import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    StatusBar,
    FlatList,
    BackHandler,
    Alert,
    Button,
    TouchableWithoutFeedback,
    AsyncStorage,
} from 'react-native';
import { Dimensions } from "react-native";
import Modal, {
    ModalTitle,
    ModalContent,
    ModalFooter,
    ModalButton
} from 'react-native-modals';
import { requiredText, tcText } from '../constants/strings';

import { Formik } from 'formik';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import { Input } from '../components';


renderRow = ({ item }) => {
    return (
        <View>
            <Text>{item.accountNo}</Text>
        </View>
    )
}


const validationSchema = yup.object().shape({
    balance: yup
        .number()
        .label('balance')
        .moreThan(0.09, "0.1 den büyük olsun")
        .lessThan(999999, "küçük yap")
        .required(requiredText),
    receiverAccountNo: yup
        .number()
        .label('accountNo')
        .min(99999999999999, 'En az 13 haneli girmelisiniz!')
        .max(9999999999999999, 'En fazla 20 karakter girebilirsiniz!')
        .required(requiredText),
});

class Virman extends React.Component {

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            accounts: [{ accountNo: 555, balance: 50 }],
            isLoading: true,
            tcNumber: this.getTc(),
            result: 0,
            selectedAccountNo: 0,
            defaultAnimationModal: false,
            isFetching: false,
        };
    }

    getTc = async () => {
        const deger = await AsyncStorage.getItem('TcNo');
        { console.log('ddddd:  ' + deger) }
        this.setState({
            tcNumber: deger
        })
    }

    listAccounts = () => {
        const tc = this.getTc();
        this.setState({
            isLoading: false
        });
        if (this.setState.tcNumber !== null) {
            console.log('tc: ' + tc)
            let url = 'https://rugratswebapi.azurewebsites.net/api/account/' + this.state.tcNumber;
            console.log('url: ' + url)
            this.setState({
                isLoading: true
            })
            fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    //console.log(responseJson);
                    this.setState({
                        accounts: responseJson
                    }, function () {
                        // console.log("yenii--- " + this.state.accounts[0].accountNo)
                    });

                }).finally(() => {
                    this.setState({
                        isLoading: false
                    })
                    // console.log("finally " + this.state.accounts[0].accountNo)
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else {
            Alert.alert("Lütfen Giriş Yapınız!");
        }
        this.setState({
            isFetching: false,
          });
    }

    componentWillMount() {
        console.log('ccccc:  ' + AsyncStorage.getItem('isLoggedIn'))
        let deger = AsyncStorage.getItem('isLoggedIn')
        if (!(deger > 0)) {
            console.log('ife girdi');
            AsyncStorage.removeItem("isLoggedIn");
        }
    }

    componentDidMount = () => {
        { console.log('ddddd:  ' + AsyncStorage.getItem('isLoggedIn')) }
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.setState({
            tcNumber: this.getTc().finally(() => {
                this.listAccounts();
            })
        });

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    makeVirman = async (balance, recieverAccNo, statement) => {
        this.setState({ defaultAnimationModal: false });
        console.log("b: "+balance+" receiAc "+ recieverAccNo+" st "+statement+" sender "+ this.state.selectedAccountNo )
        if (this.state.tcNumber !== null) {
            console.log('tc: ' + this.state.tcNumber)
            let url = 'https://rugratswebapi.azurewebsites.net/api/moneytransfers/virman';
            console.log('url: ' + url)
            this.setState({
                isLoading: true
            })
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    senderAccountNo: this.state.selectedAccountNo,
                    receiverAccountNo :recieverAccNo,
                    statement:statement,
                    amount : balance
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => {
                return response.json()
            }).then(json => {
                this.setState({
                    result: json
                });
                console.log(this.state.result);

            }).finally(() => {
                this.setState({
                    isLoading: false
                });
                let deger = '' + this.state.result;
                console.log("deger:    " + deger + "  selected No: " + this.state.selectedAccountNo);
                if (deger == "1") {
                    Alert.alert("Başarıyla Para Gönderildi!");
                    this.listAccounts();
                }
                else if (deger == "4") {
                    Alert.alert("Hesapta yeterli bakiye yok!");
                }
                else if (deger == "2") {
                    Alert.alert("Para göndermeye çalıştğınız hesap size ait değil!");
                }
                else {
                    console.log("kapatt : " + deger)
                    alert("Para Göndeme İşlemi Başarısız Oldu!");
                }
               // this.setState({ defaultAnimationModal: false });
                // console.log("finally " + this.state.accounts[0].accountNo)
            })
                .catch((error) => {
                    console.error(error);
                });;
        }
        else {
            Alert.alert("Lütfen Giriş Yapınız!");
        }
       
    }

    chooseAcc=(accountNo)=>{
        this.setState({  selectedAccountNo: accountNo });
        this.props.navigation.navigate("VirmanRecieve",{ senderAccountNo: accountNo });
    }

    onRefresh = async() =>{
        this.setState({
          isFetching: true,
        });
        this.listAccounts();
      }
    

    onBackPress = () => {
        Alert.alert(
            'Uygulammayı Kapat',
            'Uygulamadan Çıkmak İstiyor Musunuz?',
            [
                { text: 'Hayır', style: 'cancel' },
                {
                    text: 'EVet', onPress: () => {
                        BackHandler.exitApp()
                    }
                }
            ]
        );

        return true;
    }

    static navigationOptions = {
        title: 'Hesap Listesi',
    };
    render() {
        if (this.state.isLoading === false) {
            return (
                <View style={styles.container}>
                    <Text style={{ marginTop: 5, marginBottom: 5, fontSize: 18, marginLeft: Dimensions.get("window").width * 0.30 }}>Virman-Gönderen</Text>

                    <FlatList
                        data={this.state.accounts}
                        refreshing={this.state.isFetching}
                        onRefresh={() => this.onRefresh()}
                        renderItem={({ item }) =>

                            <TouchableWithoutFeedback style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>

                                <View style={styles.view}>
                                    <Text >Hesap No: {item.accountNo}</Text>
                                    <Text >Para Miktarı: {item.balance} ₺</Text>
                                    <View style={styles.item}>
                                        <Button title="Gönderen Hesabı Seçiniz" onPress={() => this.chooseAcc(item.accountNo)}></Button>
                                    </View>
                                </View>

                            </TouchableWithoutFeedback>
                        }
                    />
                    <Formik initialValues={{ balance: 0, receiverAccountNo: '',statement:"" }}
                        onSubmit={(values, actions) => {
                            this.makeVirman(values.balance,values.receiverAccountNo,values.statement);
                            
                            setTimeout(() => {
                                actions.setSubmitting(false);
                            }, 1000);

                        }}
                        validationSchema={validationSchema}>
                        {formikProps => (
                            <Modal
                                width={0.9}
                                visible={this.state.defaultAnimationModal}
                                rounded
                                actionsBordered
                                onTouchOutside={() => {
                                    //this.setState({ defaultAnimationModal: false });
                                }}
                                modalTitle={
                                    <ModalTitle
                                        title="Virman Yap"
                                        align="left"
                                    />
                                }
                                footer={
                                    <ModalFooter>
                                        <ModalButton
                                            text="İPTAL"
                                            bordered
                                            onPress={() => {
                                                this.setState({ defaultAnimationModal: false });
                                            }}
                                            key="button-1"
                                        />
                                        <ModalButton
                                            text="GÖNDER"
                                            bordered
                                            onPress={formikProps.handleSubmit}
                                            key="button-2"
                                        />
                                    </ModalFooter>
                                }
                            >
                                <ModalContent
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    <ScrollView>
                                        <Input
                                            full
                                            number
                                            maxLength={30}
                                            label="Göndereceğiniz Hesap Numarası"
                                            onChangeText={formikProps.handleChange("receiverAccountNo")}
                                            style={{ marginBottom: 5, width: 250, backgroundColor: '#cfcfcf' }}
                                        //defaultValue='1'              
                                        />
                                        <Text style={{ color: 'red', marginBottom: 2 }}>
                                            {formikProps.errors.receiverAccountNo}
                                        </Text>
                                        <Input
                                            full
                                            number
                                            label="Para Miktarı"
                                            onChangeText={formikProps.handleChange("balance")}
                                            maxLength={30}
                                            style={{ marginBottom: 10, width: 250, backgroundColor: '#cfcfcf' }}
                                        //defaultValue='1'              
                                        />
                                        <Text style={{ color: 'red', marginBottom: 2 }}>
                                            {formikProps.errors.balance}
                                        </Text>
                                        <Input
                                            full
                                            label="Açıklama"
                                            maxLength={30}
                                            style={{ marginBottom: 10, width: 250, backgroundColor: '#cfcfcf' }}
                                        //defaultValue='1'              
                                        />

                                    </ScrollView>
                                </ModalContent>
                            </Modal>
                        )}
                    </Formik>
                </View>
            );
        }
        return (
            <View>
                {console.log('hhhhhhh:  ' + AsyncStorage.getItem('isLoggedIn'))}
                <Text style={{ marginTop: 25 }}>Yükleniyor Lütfen Bekleyiniz...</Text>
            </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    view: {
        backgroundColor: '#cfcfcf',
        borderRadius: 50,
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    item: {
        backgroundColor: 'white',
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    title: {
        fontSize: 32,
    },
});

export default Virman;