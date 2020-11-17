
db_host = os.getenv('POSTGRES_HOST')
db_port = os.getenv('POSTGRES_PORT')
db_name = os.getenv('POSTGRES_DB')
db_user = os.getenv('POSTGRES_USER')
db_pass = os.getenv('POSTGRES_PASSWORD')
SQLALCHEMY_DATABASE_URI = 'postgresql://'+db_user+':'+db_pass+'@'+db_host+':'+db_port+'/'+db_name