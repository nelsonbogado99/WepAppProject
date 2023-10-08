import json
import os
import pathlib
from flask import Flask, session, abort, redirect, request, jsonify
from google_auth_oauthlib.flow import Flow
import requests
from flask_cors import CORS

app = Flask("Aplicacion")

CORS(app) 

app.secret_key = "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"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

ID_CLIENTE_GOOGLE = "578091907933-4752ajomt7b0c2eo2kjubvlvtl745dl4.apps.googleusercontent.com"
archivo_secretos_cliente = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

# Configuración de OAuth 2.0
flujo = Flow.from_client_secrets_file(
    client_secrets_file=archivo_secretos_cliente,
    scopes=["https://www.googleapis.com/auth/photoslibrary.readonly"],
    redirect_uri="http://localhost:80/callback"
)

# Funcion para verificar si el usuario ha iniciado sesion
def inicio_sesion(funcion):
    def envoltura(*args, **kwargs):
        if "google_id" not in session:
            return abort(401)
        else:
            return funcion()
    return envoltura

@app.route("/login")
def login():
    # Iniciar el flujo de autenticación OAuth
    url_autorizacion, estado = flujo.authorization_url()
    session["estado"] = estado
    return redirect(url_autorizacion)

@app.route("/callback")
def callback():
    # Procesar la respuesta de OAuth y obtener credenciales
    flujo.fetch_token(authorization_response=request.url)
    credenciales = flujo.credentials

    # Obtener todas las fotos del usuario utilizando las credenciales
    fotos = obtener_fotos(credenciales)
    
    # Extraer las URL de las fotos
    urls_de_fotos = [foto["baseUrl"] for foto in fotos]
    
    # Enviar las URL de las fotos a la página de React
    #return jsonify({"imageUrls": urls_de_fotos})
    
    return redirect(f'http://localhost:3000/photos?data={json.dumps(urls_de_fotos)}')

def obtener_fotos(credenciales):
    todas_las_fotos = []

    # Configurar la solicitud a la API de Google Photos
    url_fotos = "https://photoslibrary.googleapis.com/v1/mediaItems"
    encabezados = {
        "Authorization": f"Bearer {credenciales.token}",
        "Content-Type": "application/json"
    }
    parametros = {
        "pageSize": 100
    }

    # Realizar paginación para obtener todas las fotos
    while True:
        respuesta = requests.get(url_fotos, headers=encabezados, params=parametros)
        if respuesta.status_code == 200:
            datos = respuesta.json()
            if "mediaItems" in datos and datos["mediaItems"]:
                todas_las_fotos.extend(datos["mediaItems"])

            if "nextPageToken" in datos:
                parametros["pageToken"] = datos["nextPageToken"]
            else:
                break
        else:
            print("Error al obtener fotos de la API")
            break

    return todas_las_fotos

@app.route("/")
def inicio():
    return jsonify({"message": "Bienvenido a la página de inicio"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
