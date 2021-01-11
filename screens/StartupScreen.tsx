import React, { FC, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/colors';
import { Authenticate } from '../store/actions/auth';

const StartupScreen: FC = (props: any) => {

    const dispatch = useDispatch();

    useEffect(() => {
        
        (async () => {
            const storgeData = await AsyncStorage.getItem('AuthData');
            if(!storgeData){
                props.navigation.replace('Authenticate');
                return;
            }
            if(storgeData){
                const authData = JSON.parse(storgeData);
                const { token, userId, expDate} = authData;
                const expirationDate = new Date(expDate);
                if(expirationDate <= new Date() || !token || !userId ){
                    props.navigation.replace('Authenticate');
                    return;
                }
                dispatch(Authenticate(token, userId));
            }
        })()
    }, [dispatch]);


    return <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primary} />
    </View>
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;