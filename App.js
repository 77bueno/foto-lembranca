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
import MapView from "react-native-maps";

export default function App() {
  const regiaoInicialMapa = {
    latitude: -15,
    longitude: -55,
    latitudeDelta: 40,
    longitudeDelta: 40,
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
              mapType="satellite"
              style={estilos.mapa}
              initialRegion={regiaoInicialMapa}
            // maxZoomLevel={} // Zoom máximo permitido
            // minZoomLevel={} // Zoom mínimo permitido
            >
            </MapView>

            <Pressable style={estilos.botao}><Text>Localizar no Mapa</Text></Pressable>
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
    padding: 5,
    borderRadius: 5
  },
  titulo: {
    fontSize: 18,
    marginTop: 30,
  },
  fotoTirada: { width: 300, height: 200 },
  botao: {
    backgroundColor: "#C593FF",
    borderRadius: 5,
    padding: 5,
    margin: 15,
    width: "50%",
  },
  mapa: { width: 300, height: 200 },
});
