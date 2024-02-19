import mysql.connector
from datetime import datetime

# Configuración de la conexión a la base de datos
config = {
    'user': 'root',
    'password': 'Nelson5703320',
    'host': 'localhost',
    'database': 'googlephotos',
    'port': '3306',
}


def delete():
    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                miCursor.execute("DELETE FROM fotos")
            # Confirmar la transacción
            conexion.commit()

    except mysql.connector.Error as e:
        print(f"Error al eliminar enlaces desde la base de datos: {e}")


# Función para insertar enlaces en la base de datos
def insertar_data(enlaces_con_ids):
    try:
        # Conectarse a la base de datos
        conexion = mysql.connector.connect(**config)
        miCursor = conexion.cursor()  # Asignar un cursor aquí

        # Insertar nuevos enlaces
        for enlace_con_id in enlaces_con_ids:
            miCursor.execute("INSERT INTO fotos (id) VALUES (%s)", (enlace_con_id['id'],))

        # Confirmar la transacción
        conexion.commit()

    except mysql.connector.Error as e:
        print(f"Error al insertar enlaces en la base de datos: {e}")

    finally:
        # Cerrar el cursor y la conexión
        if 'miCursor' in locals():
            miCursor.close()
        if 'conexion' in locals():
            conexion.close()
            
            
            
def insertar_login(enlaces_con_ids):
    try:
        # Conectarse a la base de datos
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor() as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    # Obtener la fecha actual y formatearla como una cadena en el formato YYYY-MM-DD
                    fecha_actual = datetime.now()
                    fecha_login = fecha_actual.date().strftime('%Y-%m-%d')

                    # Verificar si ya existe un registro para la misma fecha y dataphotos_id
                    miCursor.execute("SELECT * FROM login WHERE correo = %s AND fecha_login = %s AND dataphotos_id = %s",
                                     (enlace_con_id['correo_electronico'], fecha_login, enlace_con_id['id']))
                    existing_record = miCursor.fetchone()

                    if existing_record:
                        print("Ya existe un registro para esta fecha y dataphotos_id, se omite la inserción.")
                        
                    else:
                        # Insertar el nuevo registro en la tabla login
                        miCursor.execute("INSERT INTO login (correo, fecha_login, dataphotos_id) VALUES (%s, %s, %s)",
                                         (enlace_con_id['correo_electronico'], fecha_login, enlace_con_id['id']))

            # Confirmar la transacción
            conexion.commit()

    except mysql.connector.Error as e:
        print(f"Error al insertar enlaces en la base de datos: {e}")

def insertar_data_fotos(enlaces_con_ids):
    try:
        # Conectarse a la base de datos
        fecha_actual = datetime.now()
        fecha_login = fecha_actual.date().strftime('%Y-%m-%d')
        
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor() as miCursor:
                # Verificar cada enlace antes de insertarlo
                for enlace_con_id in enlaces_con_ids:
                    # Verificar si el enlace ya está en la base de datos
                    miCursor.execute("SELECT id FROM dataphotos WHERE id = %s", (enlace_con_id['id'],))
                    existing_data = miCursor.fetchone()
                    
                    # Si el enlace no existe, insertarlo
                    if not existing_data:
                        miCursor.execute("INSERT INTO dataphotos (id, productUrl, baseUrl, mimeType, nombre, correo_electronico, foto_perfil_url, fecha_login, estado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                                         (enlace_con_id['id'], enlace_con_id['productUrl'], enlace_con_id['baseUrl'], enlace_con_id['mimeType'], enlace_con_id['nombre'], enlace_con_id['correo_electronico'], enlace_con_id['foto_perfil_url'], fecha_login, '1'))
                        
                # Confirmar la transacción
                conexion.commit()

    except mysql.connector.Error as e:
        print(f"Error al insertar enlaces en la base de datos: {e}")



def obtener_data_fots(enlaces_con_ids):
    urls_de_fotos = []

    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    miCursor.execute("SELECT * FROM dataphotos WHERE id = %s AND estado = '1'", (enlace_con_id['id'],))
                    row = miCursor.fetchone()
                    if row:
                        urls_de_fotos.append({
                            'id': row['id'],
                            'productUrl': row['productUrl'],
                            'baseUrl': row['baseUrl'],
                            'mimeType': row['mimeType'],
                            'nombre': row['nombre'],
                            'correo_electronico': row['correo_electronico'],
                            'foto_perfil_url': row['foto_perfil_url'],
                            'estado': row['estado']
                        })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
        
    return urls_de_fotos


def obtener_enlaces_desde_bd(enlaces_con_ids):
    urls_de_fotos = []

    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    miCursor.execute("SELECT link, tipo FROM fotos WHERE id = %s AND estado = '1'", (enlace_con_id['id'],))
                    row = miCursor.fetchone()
                    if row:
                        urls_de_fotos.append({'link': row['link'], 'tipo': row['tipo']})

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
        
def obtener_id_fotos():
    urls_de_fotos = []

    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                # Selecciona todas las columnas de la tabla fotos sin ninguna condición
                miCursor.execute("SELECT * FROM fotos")
                
                # Recorre todas las filas obtenidas
                for row in miCursor.fetchall():
                    # Agrega cada fila a la lista de datos_de_fotos
                    urls_de_fotos.append(row)

    except mysql.connector.Error as e:
        print(f"Error al obtener datos desde la base de datos: {e}")

    return urls_de_fotos



def actualizar_estado(id_enlace):
    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor() as miCursor:
                miCursor.execute("UPDATE dataphotos SET estado = 0 WHERE id = %s", (id_enlace,))
                conexion.commit()
                print(f"Estado actualizado correctamente para el enlace con ID {id_enlace}")

    except mysql.connector.Error as e:
        print(f"Error al actualizar el estado del enlace en la base de datos: {e}")
        
        
        
def obtener_fotos_eliminados(enlaces_con_ids):
    urls_de_fotos = []
   
    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    miCursor.execute("SELECT * FROM dataphotos WHERE id = %s AND estado = '0'", (enlace_con_id['id'],))
                    row = miCursor.fetchone()
                    if row:
                        urls_de_fotos.append({
                            'id': row['id'],
                            'productUrl': row['productUrl'],
                            'baseUrl': row['baseUrl'],
                            'mimeType': row['mimeType'],
                            'nombre': row['nombre'],
                            'correo_electronico': row['correo_electronico'],
                            'foto_perfil_url': row['foto_perfil_url'],
                            'estado': row['estado']
                        })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
        
    return urls_de_fotos

import mysql.connector
from datetime import datetime





def obtener_data_login(enlaces_con_ids):
    urls_de_fotos = []
    
    try:
        primer_correo_electronico = enlaces_con_ids[0]['correo_electronico']  # Obtener el correo electrónico del primer elemento de la lista
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                miCursor.execute("SELECT * FROM login WHERE correo = %s", (primer_correo_electronico,))
                rows = miCursor.fetchall()
                for row in rows:
                    fecha_login = row['fecha_login'].strftime('%Y-%m-%d') if row['fecha_login'] else None
                    urls_de_fotos.append({
                        'id': row['id'],
                        'correo_electronico': row['correo'],
                        'fecha_login': fecha_login,
                        'Id_PHotos': row['dataphotos_id'],
                    })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
    
    return urls_de_fotos


def obtener_fotos_login(enlaces_con_ids):
    urls_de_fotos = []
   
    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    miCursor.execute("SELECT * FROM dataphotos WHERE id = %s AND correo_electronico = %s ", (enlace_con_id['Id_PHotos'], enlace_con_id['correo_electronico'],))
                    row = miCursor.fetchone()
                    if row:
                        urls_de_fotos.append({
                            'productUrl': row['productUrl'],
                            'baseUrl': row['baseUrl'],
                            'mimeType': row['mimeType'],
                            'nombre': row['nombre'],
                            'fecha_login': enlace_con_id['fecha_login'],
                            'correo_electronico': row['correo_electronico']
                        })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
        
    return urls_de_fotos


def obtener_guardado(enlaces_con_ids):
    urls_de_fotos = []
   
    try:
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                for enlace_con_id in enlaces_con_ids:
                    miCursor.execute("SELECT * FROM dataphotos WHERE id = %s  ", (enlace_con_id['id'],))
                    row = miCursor.fetchone()
                    if row:
                        fecha_login = row['fecha_login'].strftime('%Y-%m-%d') if row['fecha_login'] else None
                        urls_de_fotos.append({
                            'productUrl': row['productUrl'],
                            'baseUrl': row['baseUrl'],
                            'mimeType': row['mimeType'],
                            'nombre': row['nombre'],
                            'fecha_login': fecha_login,
                            'correo_electronico': row['correo_electronico']
                        })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
        
    return urls_de_fotos


def filtro_bd(enlaces_con_ids):
    urls_de_fotos = []
    
    try:
        primer_correo_electronico = enlaces_con_ids[0]['correo_electronico']  # Obtener el correo electrónico del primer elemento de la lista
        primer_fecha_login = enlaces_con_ids[0]['fecha_login']  # Obtener la fecha de inicio de sesión del primer elemento de la lista
        with mysql.connector.connect(**config) as conexion:
            with conexion.cursor(dictionary=True) as miCursor:
                miCursor.execute("SELECT * FROM login WHERE correo = %s AND fecha_login = %s", (primer_correo_electronico, primer_fecha_login))
                rows = miCursor.fetchall()
                for row in rows:
                    fecha_login = row['fecha_login'].strftime('%Y-%m-%d') if row['fecha_login'] else None
                    urls_de_fotos.append({
                        'id': row['id'],
                        'correo_electronico': row['correo'],
                        'fecha_login': fecha_login,
                        'Id_PHotos': row['dataphotos_id'],
                    })

    except mysql.connector.Error as e:
        print(f"Error al obtener enlaces desde la base de datos: {e}")
    
    return urls_de_fotos
