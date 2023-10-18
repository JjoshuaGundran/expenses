import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function PriceBox({name, amount}) {
  return (
    <View style={styles.newBox}>
      <Text style={{fontSize: 20}}>{name}: ${amount}</Text>
    </View>
  )
}

function Chart() {
  const [total, setTotal] = useState(0);
  const [foodAmount, setFoodAmount] = useState(0);
  const [autoAmount, setAutoAmount] = useState(0);
  const [eduAmount, setEduAmount] = useState(0);
  const [entAmount, setEntAmount] = useState(0);
  const [uncAmount, setUncAmount] = useState(0);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('totals');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setFoodAmount(parseFloat(parsedData[0].value));
        setAutoAmount(parseFloat(parsedData[1].value));
        setEduAmount(parseFloat(parsedData[2].value));
        setEntAmount(parseFloat(parsedData[3].value));
        setUncAmount(parseFloat(parsedData[4].value));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const getTotal = () => {
    const newTotal = foodAmount + autoAmount + eduAmount + entAmount + uncAmount;
    setTotal(newTotal);
  }

  const data = [
    {
      name: "Food & Dining",
      amount: foodAmount,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Auto & Transport",
      amount: autoAmount,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Education",
      amount: eduAmount,
      color: "green",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Entertainment",
      amount: entAmount,
      color: "#ffff2f",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Uncategorized",
      amount: uncAmount,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
  ];

  useEffect(() => {
    loadData();
    getTotal();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <PieChart
          data={data}
          width={windowWidth-10}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            strokeWidth: 2, // optional, default 3
            useShadowColorFromDataset: false // optional
          }}
          hasLegend={true}
          avoidFalseZero={true}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            borderWidth: 1,
          }}
        />
        <PriceBox name='Food & Dining' amount={foodAmount} />
        <PriceBox name='Auto & Transport' amount={autoAmount} />
        <PriceBox name='Education' amount={eduAmount} />
        <PriceBox name='Entertainment' amount={entAmount} />
        <PriceBox name='Uncategorized' amount={uncAmount} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  newBox: {
    width: windowWidth - 150,
    margin: 10,
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  }
});

export default Chart;