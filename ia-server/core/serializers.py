from rest_framework import serializers

class RespostaModeloSerializer(serializers.Serializer):
    nome_modelo = serializers.CharField(max_length=50)
    resultado = serializers.CharField(max_length=20)

class RespostaSerializer(serializers.Serializer):
    npu = serializers.CharField(max_length=20)
    cda = serializers.CharField(max_length=20)
    #resultados = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    resultados = RespostaModeloSerializer(many=True)
        #serializers.ManyToManyField(RespostaModeloSerializer, verbose_name="lista de resultados dos modelos")
    status = serializers.CharField(max_length=20)
    mensagem = serializers.CharField(max_length=4000)
