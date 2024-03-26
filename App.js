import { useEffect, useState } from "react";
import {
  Alert,
  Button,
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

export default function App() {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null); // Para o Usuario

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if( status !== "granted" ) {
        Alert.alert("Alerta!", "Você não autorizou o uso da localização");
        return;
      }

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);

  const [localizacao, setLocalizacao] = useState(null);

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

            <Image
              style={estilos.fotoTirada}
              source={require('./assets/cr7.jpg')}
            />

            <Pressable style={estilos.botao}>
              <Text>Tirar foto!</Text>
            </Pressable>

            <MapView
              mapType="standard"
              style={estilos.mapa}
              region={ localizacao ?? regiaoInicialMapa }
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
  },
  mapa: { width: 350, height: 300 },
});
