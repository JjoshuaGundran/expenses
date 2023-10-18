import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to my Expense Tracker</Text>
        <Text style={styles.textNormal}>
          The purpose of this app is just to help track and display my expenses.
          This is just for practice and requires a lot of fixing.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Overview")}
          >
            <Text style={{color: '#ffffff'}}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Chart")}
            >
            <Text style={{color: '#ffffff'}}>Chart</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.header}>Picture of something</Text>
        <Image
          source={require('../assets/bluemojithumbsup.png')}
          style={{width: 300, height: 300, borderWidth: 1}}
        />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    height: 50,
    width: 150,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent:'center',
  },
  title: {
    margin: 50,
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  textNormal: {
    marginHorizontal: 10,
    marginBottom: 50,
    fontSize: 20,
  },
  header: {
    margin: 30,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default Home;