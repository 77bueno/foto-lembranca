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

export default function App() {
  const [localizacao, setLocalizacao] = useState({
    latitude: -33.867886,
    longitude: -63.987,
    latitudeDelta: 10,
    longitudeDelta: 10,
  });

  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 40,
    longitudeDelta: 40,
  };

  const marcarLocal = (event) => {
    console.log(event.nativeEvent);

    setLocalizacao({
      ...localizacao, // Usado pra pegar e manter os deltas

      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
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
              onPress={marcarLocal}
              initialRegion={regiaoInicialMapa}
            // maxZoomLevel={} // Zoom máximo permitido
            // minZoomLevel={} // Zoom mínimo permitido
            >
              <Marker coordinate={localizacao}></Marker>
            </MapView>

            <Pressable  style={estilos.botao}><Text>Localizar no Mapa</Text></Pressable>
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
