import React, { Component, useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';





export default function ManagerDelKitchenManager({ navigation, route }) {
    const [user, setUser] = useState()//אם יש משתמש מחובר היא מציגה אותו
    const [menuInSrartApp, setMenu] = useState(false)// בדיקה איזה מנות להציג בעת הפעלת האפליקציה
    const [cart, setCart] = useState([]) //שמירת המנות הנבחרות לעגלת קניות
    const [item, setitem] = useState([ //מנות קבועות בעת הפעלת האפליקציה
    ]);
    const [render, setRender] = useState(false)

    const storeData = async (key, value) => {//פעולה המאחסנת באסיינסטורג מידע
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (e) {
            console.log(`e`, e)
        }
    }
    const getData = async (key) => {//פעולה המקבלת מידע מהאסיינסטורג
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    const removeValue = async (key) => {//פעולה המוחקת מידע מהאסיינסטורג
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            // remove error
        }

        console.log('Done.')
    }
    function ServerApi() {// הלוקל הוסט
        const api = `http://ruppinmobile.tempdomain.co.il/site23`
        return api
    }
    const GetUsers = async () => { // משיכת משתמשים
        let v = await getData("user") //המשתמש שמחובר באסיינסטורג
        if (v === undefined) {
            await setUser(null)
        }
        else { await setUser(v) }

        fetch(`${ServerApi()}/api/getKitchenManagers`, {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                setitem(result)
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת שליפת הנתונים אנא נסה שוב מאוחר יותר")
                })


    }
    const deleteCustomer = async (item) => {//מחיקת משתמש
        let userID = item.KitchenManagersCode
        await fetch(`${ServerApi()}/api/DelKitchenManagers`, {
            method: 'POST',
            body: JSON.stringify(userID),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(res => {
                return res.json()
            })
            .then((result) => {
                console.log("fetch POST=", result)
                Alert.alert("ברכות", "משתמש זה הוסר בהצלחה")
            },
                (error) => {
                    console.log("err POST=", error)
                    Alert.alert("אופס", "ישנה בעיה בעת מחיקת המשתמש אנא נסה שוב מאוחר יותר")
                })
        setRender(true)

    }
    useEffect(() => {
        setRender(false)
        GetUsers()
    }, [render])

    return (
        <View style={styles.container}>
            {/* המבורגר , לוגו , עגלת קניות */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Feather
                        name="menu"
                        size={30}
                        style={styles.menu}
                    />
                </TouchableOpacity>
                <Image
                    source={require('../assets/logoS2/p.png')}
                    resizeMode='contain'
                    style={{
                        marginTop: 70,
                        width: '50%',
                        height: 90,
                    }}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        style={styles.shoppingCart}
                    />
                </TouchableOpacity>
            </View>
            {/* שם של המתחבר */}
            <View>
                {user == null ? null : <Text style={styles.userlogin}> שלום {user.Name}</Text>}
            </View>
            {/* הצגת מנות */}
            <ScrollView style={{ marginBottom: 40 }}>
                {item.map((item, index) => (
                    <View key={index}>
                        <View>
                            <View>
                                <View
                                    style={{
                                        backgroundColor:'#EECCA4',
                                        width: "92%",
                                        height: 50,
                                        marginRight: 15,
                                        marginLeft: 15,
                                        margin: 15,
                                        borderTopLeftRadius:18,
                                        borderBottomRightRadius:18,
                                    }}>
                               
                                <Text style={styles.name}>{item.Name}</Text>
                                <Text style={styles.desc}>{item.Email} </Text></View>
                                <TouchableOpacity style={styles.price} onPress={() => deleteCustomer(item)}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 13, color: "#FFF" }}><MaterialCommunityIcons
                                            name="delete"
                                            size={20}
                                            color={"#FFF"}
                                        />מחק </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
  
                    </View>
                ))}</ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFF',

    },
    menu: {
        marginTop: 50,
        color: 'black',
        backgroundColor: "#fff"
    },
    shoppingCart: {
        marginTop: 50,
        color: 'black'
    },
    cotert: {
        marginLeft: 45,
        fontSize: 30,
    },
    catgor: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    price: {

        position: 'absolute',
        bottom: 15,
        marginLeft: "78.2%",
        height: 50,
        width: 15,
        backgroundColor: "red",
        borderBottomRightRadius: 18,
        borderTopLeftRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,

    },
    desc: {
        fontWeight: 'bold', fontSize: 15, color: "#9A7759",
        marginLeft: 20,
        marginTop: -20,
        textAlign:'left',

    },
    name_stars: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: -15,


    },
    name: {
        fontWeight: 'bold', fontSize: 20, color: "#9A7759",
        marginLeft: 20,
        height: 50,
        textAlign:'left',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    star: {
        color: "gold",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    stars: {
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    userlogin: {
        fontWeight: 'bold', fontSize: 22, color: "#9A7759",
        marginLeft: 20,
    }


})
