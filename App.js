import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null); // Para o Usuario
  const [foto, setFoto] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [texto, setTexto] = useState("");


  /* State para checagem de permissões de uso (através do hook useCameraPermission) */
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  console.log(status);
  useEffect(() => {
    async function VerificaPermissoes() {
      const statusCamera = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(statusCamera === "granted")
    }

    VerificaPermissoes();
  }, []);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Alerta!", "Você não autorizou o uso da localização");
        return;
      }

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!imagem.canceled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  const marcarLocal = () => {
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  const salvar = async () => {
    try {
      const favoritos = await AsyncStorage.getItem("@favoritobueno");
      const listaDeFotos = favoritos ? JSON.parse(favoritos) : [];
      
      const fotoNova = { foto: foto, localizacao: localizacao, texto: texto };
      listaDeFotos.push(fotoNova);
      await AsyncStorage.setItem("@favoritobueno", JSON.stringify(listaDeFotos));
      console.log(listaDeFotos);
      Alert.alert("Sucesso!", "Lembrança salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar a foto: ", error);
      Alert.alert("Erro!", "Ocorreu um erro ao salvar a foto");
    }
  };
  return (
    <>
      <SafeAreaView style={estilos.container}>
        <StatusBar style="auto" />
        <ScrollView>
          <View style={estilos.ViewFoto}>
            <Text style={estilos.titulo}>Bem vindo ao Foto Lembrança!</Text>

            <TextInput
              onChangeText={(text) => setTexto(text)}
              maxLength={50}
              minLength={5}
              placeholder="Escreva o título da foto/local!"
              style={estilos.textoInput}
            />

            {foto ? (
              <Image source={{ uri: foto }} style={{ width: 350, height: 300 }} />
            ) : (
              <Text>Sem foto selecionada!</Text>
            )}


            <Pressable onPress={escolherFoto} style={estilos.botao}>
              <Text>Escolher Foto</Text>
            </Pressable>


            <Pressable onPress={acessarCamera} style={estilos.botao}>
              <Text>Tirar Foto</Text>
            </Pressable>


            <MapView
              mapType="standard"
              style={estilos.mapa}
              region={localizacao ?? regiaoInicialMapa}
            // maxZoomLevel={} // Zoom máximo permitido
            // minZoomLevel={} // Zoom mínimo permitido
            >
              {localizacao && <Marker coordinate={localizacao} />}
            </MapView>

            <Pressable onPress={marcarLocal} style={estilos.botao}><Text>Localizar no Mapa</Text></Pressable>
            <Pressable onPress={salvar} style={estilos.botao}><Text>Salvar lembrança 🌟</Text></Pressable>

            <View>
              <Text>Salvos abaixo</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>

  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 20,
    marginTop: 40,
  },
  fotoTirada: { width: 200, height: 200 },
  botao: {
    backgroundColor: "#C593FF",
    borderRadius: 5,
    padding: 12,
    marginTop: 15,
    marginBottom: 15,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  mapa: { width: 350, height: 300 },
});
