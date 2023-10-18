import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, SafeAreaView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Overview() {
    const [amount, setAmount] = useState('');
    const [expenseType, setExpenseType] = useState('');
    const [date, setDate] = useState(new Date());

    const [expenses, setExpenses] = useState([]); // object to save to AsyncStorage under 'expenses'
    const [typeAmount, setTypeAmount] = useState([]); // object to save to AsyncStorage under 'totals'

    const type = [ // values for dropdown list
        {key:'1', value:'Food & Dining'},
        {key:'2', value:'Auto & Transport'},
        {key:'3', value:'Education'},
        {key:'4', value:'Entertainment'},
        {key:'5', value:'Uncategorized'},
    ]

    const saveExpensesToStorage = async () => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
            console.log("loaded expenses:", expenses);
        } catch (error) {
            console.error("Error saving expenses:", error);
        }
    }

    const saveTypeAmountToStorage = async () => { // save value to type in async storage
        try {
            await AsyncStorage.setItem('totals', JSON.stringify(typeAmount));
            console.log("loaded type amount:", typeAmount);
        } catch (error) {
            console.error('Error saving typeAmount:', error);
        }
    }

    const typeAmountAction = (newTotal, selectedType) => {
        setTypeAmount((prevTypeAmount) => {
            const updatedTypeAmount = [...prevTypeAmount]; // gets current category list and their totals
            const indexToUpdate = updatedTypeAmount.findIndex((item) => item.key === selectedType.key); // find the category that needs to be updated

            if (indexToUpdate !== -1) {
                updatedTypeAmount[indexToUpdate].value = newTotal.toFixed(2).toString(); // sets the total value for the cateogry to new total
                saveTypeAmountToStorage(updatedTypeAmount); // calls type amount async storage save function
            }
            return updatedTypeAmount;
        });
    }

    const addExpense = () => { // adds expense to list
        const newExpense = { // create expense object to add onto list
            amount: parseFloat(amount).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            numAmount: parseFloat(amount),
            type: expenseType,
            date: date.toISOString(),
        };
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]); // appends newExpense to expenses list

        const selectedType = type.find((item) => item.value === expenseType); // find saved object from type list
        const typeValue = typeAmount.find((item) => item.name === expenseType); // get current total of the specified category
        const newTotal = parseFloat(typeValue.value) + parseFloat(amount); // gets new total of the specified category

        typeAmountAction(newTotal, selectedType);

        // reset input fields
        setAmount('');
        setDate(new Date());
    }

    const removeExpense = (indexToRemove) => { // remove object from expense list
        const selectedType = type.find((item) => item.value === expenses[indexToRemove].type); // find saved object from type list
        const typeValue = typeAmount.find((item) => item.name === expenses[indexToRemove].type); // get current total of the specified category
        const newTotal = parseFloat(typeValue.value) - parseFloat(expenses[indexToRemove].numAmount); // gets new total of the specified category

        typeAmountAction(newTotal, selectedType); // calls function to set new total for category (new total, category)

        const updatedExpenses = expenses.filter((_, index) => index !== indexToRemove); // updates expense list, excluding the removed expense
        setExpenses(updatedExpenses); // saves new expense list
}

    useEffect(() => { // on load of page, retrieve 'expenses' and 'totals' async data
        const loadExpenses = async () => {
            try {
                const savedExpenses = await AsyncStorage.getItem('expenses'); // retrieve 'expenses' JSON data
                const savedTotal = await AsyncStorage.getItem('totals'); // retrieve 'totals' JSON data

                if (savedExpenses !== null) { // if not empty, load expenses
                    setExpenses(JSON.parse(savedExpenses));
                }
                if (savedTotal !== null && savedTotal !== "[]") { // if not empty, load totals
                    setTypeAmount(JSON.parse(savedTotal));
                } else { // if empty, initialize list to default
                    setTypeAmount([
                        {key:'1', value:0, name:'Food & Dining'},
                        {key:'2', value:0, name:'Auto & Transport'},
                        {key:'3', value:0, name:'Education'},
                        {key:'4', value:0, name:'Entertainment'},
                        {key:'5', value:0, name:'Uncategorized'},
                    ]);
                }
            } catch (error) {
                console.error('Error loading:', error);
            }
        };

        loadExpenses();
    }, []);

    useEffect(() => { // on change of expenses, save data to local async storage
        saveExpensesToStorage(expenses);
    }, [expenses]);

    const clearAsyncStorage = async () => { // help debug and test project. clears all local data
        try {
            await AsyncStorage.clear(); // Clear AsyncStorage
            setExpenses([]); // Clear the expenses state to an empty array
            setTypeAmount([ // Reset the typeAmount state to default values
                { key: '1', value: 0, name: 'Food & Dining' },
                { key: '2', value: 0, name: 'Auto & Transport' },
                { key: '3', value: 0, name: 'Education' },
                { key: '4', value: 0, name: 'Entertainment' },
                { key: '5', value: 0, name: 'Uncategorized' },
            ]);
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    }

    const isAddButtonDisabled = amount === '' || expenseType === ''; // track if amount and expenseType is empty. If empty, button is greyed out

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.header}>Insert expense</Text>
                <View style={styles.containerExpense}>
                    <TextInput
                        style={styles.options}
                        placeholder='Amount'
                        value={amount}
                        onChangeText={(text) => setAmount(text)}
                        keyboardType="numeric"
                    />
                    <SelectList
                        setSelected={(val) => setExpenseType(val)}
                        style={styles.options}
                        data={type}
                        search={false}
                        save="value"
                    />
                    <RNDateTimePicker
                        style={styles.options}
                        value={date}
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || date;
                            setDate(currentDate);
                        }}
                    />
                </View>
                <Button
                    title='Add Expense'
                    onPress={addExpense}
                    disabled={isAddButtonDisabled}
                />
                <Button
                    title='Delete all?'
                    onPress={clearAsyncStorage}
                />
                <FlatList
                    data={expenses.slice().reverse()}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => (
                        <View style={styles.expenseItem}>
                            <Text style={{width: 70}}>{item.amount}</Text>
                            <Text>{item.type}</Text>
                            <Text>{new Date(item.date).toLocaleDateString()}</Text>
                            <Button
                                title="Remove"
                                onPress={() => removeExpense(index)}
                            />
                        </View>
                    )}
                />
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
    containerExpense: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'stretch',
        margin: 10,
        padding: 15,
        borderWidth: 1,
        borderRadius: 5,
    },
    header: {
        margin: 30,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
    },
    options: {
        flex: 1,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        width: 400,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
})

export default Overview;