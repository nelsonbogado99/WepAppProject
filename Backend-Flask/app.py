
import os
import json
import pathlib
from datetime import datetime
from flask import Flask, session, abort, redirect, request, jsonify, url_for
from google_auth_oauthlib.flow import Flow
import requests
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google.auth.exceptions import RefreshError
import io
from PIL import Image
from database import (
    obtener_data_fots,
    insertar_data_fotos,
    obtener_id_fotos,
    obtener_data_login,
    actualizar_estado,
    insertar_data,
    insertar_login,
    obtener_fotos_login,
    delete,
    filtro_bd,
    obtener_fotos_eliminados,
)

app = Flask("Aplicacion")
CORS(app)

app.secret_key = "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"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

ID_CLIENTE_GOOGLE = "110622140547-1rv2366ho2efa1ep5t86v1r4te22m888.apps.googleusercontent.com"
archivo_secretos_cliente = os.path.join(pathlib.Path(__file__).parent, "client.json")

# Configuración de OAuth 2.0
flujo = Flow.from_client_secrets_file(
    client_secrets_file=archivo_secretos_cliente,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/photoslibrary",
        "https://www.googleapis.com/auth/photoslibrary.appendonly",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/photoslibrary.readonly",
        "openid",
    ],
    redirect_uri="http://localhost:80/callback",
)

# Función decoradora para verificar si el usuario ha iniciado sesión
def inicio_sesion(funcion):
    def envoltura(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        else:
            return funcion()
    return envoltura

google_photos_credentials = " "

# Ruta para iniciar sesión
@app.route("/login")
def login():
    session.clear()
    url_autorizacion, estado = flujo.authorization_url() 
    session["estado"] = estado
 
    return redirect(url_autorizacion)

# Ruta de retorno de la autorización
@app.route("/callback")
def callback():
   
    flujo.fetch_token(authorization_response=request.url)
    credenciales = flujo.credentials
    
    global manejo_credenciales
    google_photos_credentials= credenciales
   
    info_usuario = obtener_informacion_del_usuario(credenciales)
    
    nombre = info_usuario.get('name', '')
    correo_electronico = info_usuario.get('email', 'No disponible')
    foto_perfil_url = info_usuario.get('picture', '')
    medias = obtener_fotos(credenciales)
    
    for media in medias:
        media['nombre'] = nombre
        media['correo_electronico'] = correo_electronico
        media['foto_perfil_url'] = foto_perfil_url

    delete()
    insertar_data(medias)
    insertar_login(medias)
    insertar_data_fotos(medias)    
    data_fotos = obtener_data_fots(medias)

    return redirect(f'http://localhost:3000/photos?data={json.dumps(data_fotos)}')

# Función para obtener información del usuario
def obtener_informacion_del_usuario(credenciales):
    url_usuario = "https://www.googleapis.com/oauth2/v2/userinfo"
    encabezados = {"Authorization": f"Bearer {credenciales.token}"}

    respuesta = requests.get(url_usuario, headers=encabezados)
    if respuesta.status_code == 200:
        perfil_info = respuesta.json()
    else:
        print("Error al obtener información del usuario.")
        perfil_info = {}

    return perfil_info

# Función para obtener fotos y videos
def obtener_fotos(credenciales):
    fotos = []
    url_medias = "https://photoslibrary.googleapis.com/v1/mediaItems"
    encabezados = {
        "Authorization": f"Bearer {credenciales.token}",
        "Content-Type": "application/json"
    }
    parametros = {
        "pageSize": 100
    }

    while True:
        respuesta = requests.get(url_medias, headers=encabezados, params=parametros)
        if respuesta.status_code == 200:
            datos = respuesta.json()
            if "mediaItems" in datos and datos["mediaItems"]:
                fotos.extend(datos["mediaItems"])

            if "nextPageToken" in datos:
                parametros["pageToken"] = datos["nextPageToken"]
            else:
                break
        else:
            print("Error al obtener fotos y videos de la API")
            break
    return fotos

# Ruta para cargar fotos
@app.route("/cargar-fotos", methods=["POST"])
def cargar_fotos():
    try:
        photo = request.files['photo']
        global manejo_credenciales
        credenciales = manejo_credenciales
      
        url_subir_foto = "https://photoslibrary.googleapis.com/v1/uploads"
        encabezados = {
            "Authorization": f"Bearer {credenciales.token}",
            "Content-Type": "application/octet-stream",
            "X-Goog-Upload-File-Name": photo.filename,
            "X-Goog-Upload-Protocol": "raw"
        }
    
        with open(photo.filename, "rb") as archivo:
            respuesta_subir_foto = requests.post(url_subir_foto, headers=encabezados, data=archivo)
        
        upload_token = respuesta_subir_foto.content.decode("utf-8")

        url_crear_foto = "https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate"
        body = {
            'newMediaItems': [
                {
                    'description': 'Descripción de la foto',
                    'simpleMediaItem': {
                        'uploadToken': upload_token
                    }
                }
            ]
        }
        
        respuesta_crear_foto = requests.post(url_crear_foto, headers=encabezados, json=body)       
        id_foto = respuesta_crear_foto.json()['newMediaItemResults'][0]['mediaItem']['id']
        
        return id_foto
    except Exception as e:
        print("Error al subir la foto:", e)
        return None

# Ruta para obtener datos de la base de datos
@app.route("/data-base", methods=["GET"])
def data_base():
    data_id = obtener_id_fotos()
    data_fotos = obtener_data_fots(data_id)
    data_login = obtener_data_login(data_fotos)
    data_user = obtener_fotos_login(data_login)
    
    return data_user

# Ruta para obtener datos filtrados
@app.route("/filtro", methods=["GET"])
def obtener_filtro():
    fecha = request.args.get("fecha")
    data_id = obtener_id_fotos()
    data_fotos = obtener_data_fots(data_id)
    for elemento in data_fotos:
        elemento["fecha_login"] = fecha 
    data_login = filtro_bd(data_fotos)
    data_user = obtener_fotos_login(data_login)
    
    return data_user

# Ruta para eliminar una foto
@app.route("/eliminar-foto/<string:id>", methods=["DELETE"])
def eliminar_foto(id):
    
    actualizar_estado(id)
    data_id = obtener_id_fotos()
    data_fotos = obtener_data_fots(data_id)
    
    return jsonify(data_fotos)

# Ruta para obtener fotos eliminadas
@app.route("/eliminado", methods=["GET"])
def eliminado():
    try:
        data_id = obtener_id_fotos()
        data_fotos = obtener_fotos_eliminados(data_id)
        return jsonify(data_fotos)
    except Exception as e:
        print("Error al procesar los datos:", e)
        return jsonify({"error": "Error al procesar los datos"}), 400
    
# Ruta para obtener datos
@app.route("/data", methods=["GET"])
def data():
    try:
        data_id  = obtener_id_fotos()
        data_fotos = obtener_data_fots(data_id )
        return jsonify(data_fotos)
    except Exception as e:
        print("Error al procesar los datos:", e)
        return jsonify({"error": "Error al procesar los datos"}), 400
    
# Ruta de inicio
@app.route("/")
def inicio():
    return jsonify({"message": "Bienvenido a la página de inicio"})

# Ejecutar la aplicación
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
