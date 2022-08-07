import React, {useState, useEffect, useContext} from "react"
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
// import {ListItem} from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import db from "../../Services/sqlite/connect";
import axios from 'axios'
import { AuthContext } from '../../contexts/auth'
import Icon from 'react-native-vector-icons/FontAwesome';

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



const api = axios.create({
    baseURL:'http://project.mohatron.com/projectRestaurantes/api/'
})

export default ListaUsuarios => {

    const navegation = useNavigation()
    const {AtivarRestaurante} = useContext(AuthContext)

    const [usuarios, setusuarios] = useState([])


    function AtualizarListaUsuarios(){
        // (codigo, nome, cpf, telefone, restaurante, titulo, local, endereco, data, upload)

        let data = new Date();
        let dataFormatada = data.getFullYear() + "-" + ((data.getMonth() + 1)) + "-" + (data.getDate());
        // console.warn(dataFormatada)
        comandoSql( `SELECT * FROM usuarios where upload != 's' or data like '%${dataFormatada}%'`)
        .then( retorno => {

            // api.post('/cadUser.php', {
            //     codigo: sessaoUsuario.codigo,
            //     nome: data.nome,
            //     cpf: sessaoUsuario.cpf,
            //     telefone: data.telefone,
            //     titulo: sessaoRestaurante.titulo,
            //     local: sessaoRestaurante.local,
            //     restaurante: sessaoRestaurante.restaurante,
            //     endereco: data.endereco,
            //     data: 'data',
            // }).then(({data}) => {
            //     // console.warn(data)
            //     //  alert(data.message)
            //     if(data.status){
            //         comandoSql( `UPDATE usuarios SET upload = 's' WHERE codigo = '${sessaoUsuario.codigo}'`)
            //     }


            // }).catch( err => console.warn('no upload: ' + err) )

            const dados = [];
            // alert(retorno.rows.length)
            retorno.rows._array.forEach( c => {
                // results.push(c)
                // console.warn('NÃO TEM:')
                // console.warn(c)
                dados.push(c)

            })
            setusuarios(dados)

        })
    }

    useEffect(()=>{

        AtualizarListaUsuarios()


    },[])


    function EnviarNuvem(cod = false){
        if(cod){
            var query = `SELECT * FROM usuarios where codigo = '${cod}'`
            // alert('com codigo')
        }else{
            var query = `SELECT * FROM usuarios where upload != 's'`
            // alert('sem codigo')
        }
        comandoSql(query)
        .then( retorno => {
            const dados = [];
            // alert(retorno.rows.length)
            retorno.rows._array.forEach( c => {
                // console.warn(c)
                api.post('/cadUser.php', {
                    codigo: c.codigo,
                    nome: c.nome,
                    cpf: c.cpf,
                    telefone: c.telefone,
                    titulo: c.titulo,
                    local: c.local,
                    restaurante: c.restaurante,
                    endereco: c.endereco,
                    data: c.data,
                }).then(({data}) => {
                    // console.warn(data)
                    //   alert(data.message)
                    if(data.status){
                        comandoSql( `UPDATE usuarios SET upload = 's' WHERE codigo = '${c.codigo}'`)
                        AtualizarListaUsuarios()
                    }

                }).catch( err => console.warn('no upload: ' + err) )


            })
        })
    }


    function getUsuariosItem({item}){

        const Cor = (item.upload == 's' ? '#1daf4c':'#cccccc')

        return (

            // <TouchableOpacity style={{
            //     flex:1,
            //     flexDirection:'row',
            //     paddingVertical:10,
            //     marginBottom:10,
            //     borderRadius:7,
            //     borderBottomWidth:1
            // }}

            // onPress={()=> {}}

            // >
                // {/* <Text style={{
                //     paddingHorizontal:10,
                //     fontSize:20,
                //     color:'#fff',
                // }}>{item.codigo}</Text> */}
            <View style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'space-between',
                paddingVertical:10,
                marginBottom:10,
                borderRadius:7,
                borderBottomWidth:1
            }}>

                <View style={{
                    flex:1,
                    flexDirection:'column',
                }}>
                    <Text style={{
                        paddingHorizontal:16,
                        fontSize:10,
                        color:'#a1a1a1',
                    }}>{item.cpf} - {item.telefone}</Text>
                    <Text style={{
                        paddingHorizontal:16,
                        fontSize:20,
                        color:'#333',
                    }}>{item.nome}</Text>
                    {/* <Text style={{
                        paddingHorizontal:16,
                        fontSize:15,
                        color:'#fff',
                    }}>{item.local}</Text> */}
                </View>

                <View style={{flexDirection:'row'}}>
                    {/* <TouchableOpacity style={{
                            marginRight:20,
                        }}
                        onPress={()=> {}}
                    >
                        <Icon name="meh-o" size={30} color="#333" />
                    </TouchableOpacity> */}
                    {
                        item.upload != 's' ?
                            <TouchableOpacity style={{
                                    marginRight:20,
                                }}
                                onPress={()=> {EnviarNuvem(item.codigo)}}
                            >

                                <Icon name="cloud" size={30} color={Cor} />
                            </TouchableOpacity>
                        :<Icon name="check" size={20} color='green' style={{marginEnd:20}} />
                    }

                </View>

            </View>

            // {/* </TouchableOpacity> */}

        )
    }


    return (
        <View style={{flex:1}}>
            <View style={{flex:1,marginTop:30, marginHorizontal:15, paddingBottom:50,}}>
                <Text style={{
                    paddingVertical:10,
                    fontSize:20,
                }}>Lista de Usuários</Text>
                <FlatList
                    keyExtractor={usuario => usuario.codigo}
                    data={usuarios}
                    renderItem={getUsuariosItem}
                />
            </View>
            <View style={{padding:30, width:'100%', alignItems:'center', justifyContent:'center'}}>
                <TouchableOpacity style={{
                        flexDirection:'row',
                        padding:10,
                        backgroundColor:'#1daf4c',
                        alignItems:'center',
                        justifyContent:'center',
                        borderRadius:50,
                        width:'60%'
                    }}
                    onPress={()=> {EnviarNuvem()}}
                >
                    <Icon name="cloud" size={30} color='#fff' />
                    <Text style={{color:'#fff', fontSize:15, marginHorizontal:20, fontWeight:'bold'}}>Enviar dados ao servidor</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}