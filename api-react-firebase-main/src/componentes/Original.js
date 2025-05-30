import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';

const Original = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener películas de la API
        const moviesResponse = await fetch('https://ghibliapi.dev/films');
        const movies = await moviesResponse.json();
        
        // Crear preguntas basadas en las películas
        const generatedQuestions = movies.slice(0, 5).map(movie => {
          // Pregunta sobre el director
          const directorQuestion = {
            type: 'director',
            question: `¿Quién dirigió "${movie.title}"?`,
            image: movie.image,
            options: [
              movie.director,
              'Hayao Miyazaki',
              'Isao Takahata',
              'Gorō Miyazaki'
            ].sort(() => Math.random() - 0.5),
            correctAnswer: movie.director,
            movieTitle: movie.title
          };

          // Pregunta sobre el año
          const yearQuestion = {
            type: 'year',
            question: `¿En qué año se estrenó "${movie.title}"?`,
            image: movie.image,
            options: [
              movie.release_date.split('-')[0],
              (parseInt(movie.release_date.split('-')[0]) + 2).toString(),
              (parseInt(movie.release_date.split('-')[0]) - 3).toString(),
              (parseInt(movie.release_date.split('-')[0]) + 5).toString()
            ].sort(() => Math.random() - 0.5),
            correctAnswer: movie.release_date.split('-')[0],
            movieTitle: movie.title
          };

          return [directorQuestion, yearQuestion];
        }).flat();

        setQuestions(generatedQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando magia Ghibli... ✨</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Ghibli 🎬</Text>
      <Text style={styles.subtitle}>Demuestra cuánto sabes sobre las películas</Text>
      
      {!showResult && questions.length > 0 ? (
        <View style={styles.questionCard}>
          <View style={styles.movieHeader}>
            <Text style={styles.movieTitle}>{questions[currentQuestion].movieTitle}</Text>
            <Text style={styles.questionProgress}>
              Pregunta {currentQuestion + 1}/{questions.length}
            </Text>
          </View>
          
          <View style={styles.movieImageContainer}>
            <Image 
              source={{ uri: questions[currentQuestion].image || 'https://via.placeholder.com/300x200?text=Studio+Ghibli' }} 
              style={styles.movieImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          
          <View style={styles.optionsGrid}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionBtn,
                  selectedOption !== null && 
                  option === questions[currentQuestion].correctAnswer 
                    ? styles.correctOption 
                    : null,
                  selectedOption === option && 
                  option !== questions[currentQuestion].correctAnswer 
                    ? styles.wrongOption 
                    : null
                ]}
                onPress={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : showResult ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>¡Resultados Finales!</Text>
          <View style={styles.scoreDisplay}>
            <Text style={styles.scoreText}>
              Obtuviste <Text style={styles.scoreNumber}>{score}</Text> de <Text style={styles.scoreTotal}>{questions.length}</Text> correctas
            </Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreProgress, 
                  { width: `${(score / questions.length) * 100}%` }
                ]}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.restartBtn} onPress={restartQuiz}>
            <Text>⏮️ Volver a Jugar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No se pudieron cargar las preguntas</Text>
      )}
      
      <View style={styles.ghibliFact}>
        <Text>💡 Sabías que: Studio Ghibli fue fundado en 1985 por Hayao Miyazaki, Isao Takahata y Toshio Suzuki</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  questionCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  movieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionProgress: {
    color: '#666',
  },
  movieImageContainer: {
    height: 200,
    marginBottom: 15,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBtn: {
    width: '48%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  correctOption: {
    backgroundColor: '#a5d6a7',
  },
  wrongOption: {
    backgroundColor: '#ef9a9a',
  },
  resultCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scoreDisplay: {
    width: '100%',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreNumber: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  scoreTotal: {
    fontWeight: 'bold',
  },
  scoreBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  restartBtn: {
    padding: 10,
    backgroundColor: '#bbdefb',
    borderRadius: 5,
  },
  ghibliFact: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 5,
  },
});

export default Original;