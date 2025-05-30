import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Detalle = () => {
  const { params } = useRoute();
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`https://ghibliapi.dev/films/${params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Película no encontrada");
        return response.json();
      })
      .then((data) => {
        setPelicula(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching detalles:", error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Cargando...</Text>
    </View>
  );

  if (!pelicula) return (
    <View style={styles.errorContainer}>
      <Text>Película no encontrada</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        style={styles.poster}
        source={{ uri: pelicula.image }}
        defaultSource={{ uri: 'https://via.placeholder.com/300x400?text=Poster+no+disponible' }}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle}>{pelicula.title}</Text>
        <Text><Text style={styles.label}>Título original:</Text> {pelicula.original_title}</Text>
        <Text><Text style={styles.label}>Director:</Text> {pelicula.director}</Text>
        <Text><Text style={styles.label}>Año:</Text> {pelicula.release_date}</Text>
        <Text><Text style={styles.label}>Puntuación:</Text> ⭐ {pelicula.rt_score}/100</Text>
        <Text style={styles.description}>{pelicula.description}</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text>← Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  infoContainer: {
    marginTop: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
});

export default Detalle;