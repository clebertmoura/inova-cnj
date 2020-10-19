import json
import os

CONFIG_FILE = "ElisConfigs.json"

class Configs:

    @staticmethod
    def readConfig(chave):
        valor = ""
        path = os.path.abspath(CONFIG_FILE)
        with open(path) as conf:
            dados = json.load(conf)
        valor = dados[chave]

        return valor




