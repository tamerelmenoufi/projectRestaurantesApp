import React, {useState, useEffect, useContext} from "react"
import { View,
         Text,
         StyleSheet,
         TouchableOpacity
        } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import db from "../../Services/sqlite/connect";
import { AuthContext } from '../../contexts/auth'
import { TextInputMask } from 'react-native-masked-text'
import Icon from 'react-native-vector-icons/AntDesign'

const comandoSql = (query) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
            query,
            [],
            //-----------------------
            (_, { rowsAffected, insertId, rows }) => {
            resolve({rowsAffected, insertId, rows})
            // if (rowsAffected > 0) resolve({rowsAffected, insertId, rows});
            // else reject("Error inserting query: " + JSON.stringify(query)); // insert falhou
            },
            (_, error) => reject('Erro de cadastro: '+error) // erro interno em tx.executeSql
        );
        });
    });
};

export default function Login(){
    const navegation = useNavigation()

    const {sessaoRestaurante:logado, logarUsuario, sessaoUsuario} = useContext(AuthContext)

    const [cpf, setCpf] = useState('');
    // sessaoUsuario.cpf  valor  em ^


    useEffect(()=>{



    },[])

    return(
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation="flipInY"
                    source={require('../../assets/logo.png')}
                    style={{width:'100%'}}
                    resizeMode="contain"
                />
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>

                <View style={{flex:2}}>
                    <Text style={styles.formTitle}>Prato Cheio - Governo do Estado do Amazonas</Text>
                    <Text style={styles.formText}>Você está logado em {logado.titulo} {logado.local}</Text>
                </View>

                <View style={{flex:3}}>
                    <Text style={styles.formTitle}>CPF do Usuário</Text>
                    {/* <TextInputMask
                        placeholder="Digite o número do CPF ..."
                        style={styles.formInput}
                        value={cpf}
                        onChangeText={(text)=>{setCpf(text)}}
                        type={'cel-phone'}
                        options={{
                            maskType:'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                        }}
                    /> */}
                    <TextInputMask
                        placeholder="Digite o número do CPF ..."
                        style={styles.formInput}
                        value={cpf}
                        onChangeText={(text)=>{setCpf(text)}}
                        type={'cpf'}
                    />
                </View>
                <View style={{flex:3, flexDirection:'row', justifyContent:'center', alignItems:'baseline'}}>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={()=> logarUsuario(cpf)}
                    >
                        <Icon name="codesquareo" size={50} color="#fff" />
                        <Text style={styles.formButtonText}>INICIAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                            style={styles.button2}
                            onPress={()=> navegation.navigate("QrCode")}
                        >
                            <Icon name="scan1" size={50} color="#fff" />
                            <Text style={styles.formButtonText}>QrCode</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                            style={styles.button3}
                            onPress={()=> navegation.navigate("Cadastros")}
                        >
                            <Icon name="user" size={50} color="#fff" />
                            <Text style={styles.formButtonText}>Cadastro</Text>
                    </TouchableOpacity>

                </View>

            </Animatable.View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#1daf4c'
    },
    containerLogo:{
        flex:1,
        justifyContent:'center',
        textAlign:'center'
    },
    containerForm:{
        flex:2,
        backgroundColor:'#fff',
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        paddingStart:'5%',
        paddingEnd:'5%'
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:28,
        marginTop:28
    },
    text:{
        color:'#a1a1a1'
    },
    button:{
        position:'relative',
        backgroundColor:'#1daf4c',
        borderRadius:50,
        paddingVertical:8,
        width:'30%',
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center',
        margin:10,
    },
    button2:{
        position:'relative',
        backgroundColor:'blue',
        borderRadius:50,
        paddingVertical:8,
        width:'30%',
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center',
        margin:10,
    },
    button3:{
        position:'relative',
        backgroundColor:'orange',
        borderRadius:50,
        paddingVertical:8,
        width:'30%',
        alignSelf:'center',
        bottom:'15%',
        alignItems:'center',
        justifyContent:'center',
        margin:10,
    },
    buttonText:{
        fontSize:18,
        color:'#fff',
        fontWeight:'bold'
    },

    containerForm:{
        backgroundColor:'#fff',
        borderTopLeftRadius:25,
        borderTopEndRadius:25,
        flex:1,
        paddingEnd:'5%',
        paddingStart:'5%'
    },
    formTitle:{
        fontSize:20,
        marginTop:28,
    },
    formInput:{
        borderBottomWidth:1,
        height:40,
        marginBottom:12,
        fontSize:16,
    },
    formButton:{
        backgroundColor:'#1daf4c',
        width:'100%',
        borderRadius:4,
        paddingVertical:8,
        marginTop:14,
        justifyContent:'center',
        alignItems:'center'
    },
    formButtonText:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold'
    },
    formButtonRegister:{
        marginTop:14,
        alignSelf:'center',
    },
    formButtonRegisterText:{
        color:'#a1a1a1',
    }

})