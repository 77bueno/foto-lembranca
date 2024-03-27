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

export default function App() {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null); // Para o Usuario
  const [foto, setFoto] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);


  /* State para checagem de permissões de uso (através do hook useCameraPermission) */
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

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

  const marcarLocal = (event) => {
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  return (
    <>
      <SafeAreaView style={estilos.container}>
        <StatusBar style="auto" />
        <ScrollView>
          <View style={estilos.ViewFoto}>
            <Text style={estilos.titulo}>Bem vindo ao Foto Lembrança!</Text>

            <TextInput
              maxLength={50}
              minLength={5}
              placeholder="Escreva o título da foto/local!"
              style={estilos.textoInput}
            />

            {foto ? (
              <Image source={{ uri: foto }} style={{ width: 300, height: 300 }} />
            ) : (
              <Text>Sem foto!</Text>
            )}


            <Pressable onPress={escolherFoto} style={estilos.botao}>
              <Text>Escolher foto!</Text>
            </Pressable>

            <Pressable onPress={acessarCamera} style={estilos.botao}>
              <Text>Tirar foto!</Text>
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
