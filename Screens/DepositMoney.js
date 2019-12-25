import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
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
import DialogInput from 'react-native-dialog-input';


renderRow = ({ item }) => {
  return (
    <View>
      <Text>{item.accountNo}</Text>
    </View>
  )
}


class DepositMoney extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      accounts: [{ accountNo: 555, balance: 50 }],
      isLoading: true,
      tcNumber: this.getTc(),
      result: 0,
      isDialogVisible: false,
      selectedAccountNo: 0,
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

  toDepositMoney = async (balance) => {
    if (this.state.tcNumber !== null) {
      console.log('tc: ' + this.state.tcNumber)
      let url = 'https://rugratswebapi.azurewebsites.net/api/account/toDepositMoney';
      console.log('url: ' + url)
      this.setState({
        isLoading: true
      })
      await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          accountNo: this.state.selectedAccountNo,
          Balance: balance
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
          Alert.alert("Başarıyla Para Yatırıldı!");
          this.listAccounts();
        }
        else if (deger == "0") {
          Alert.alert("Hesap Bulunamdı!");
        }
        else {
          console.log("kapatt : " + deger)
          alert("Para Yatırma İşlemi Başarısız Oldu!");
        }

        // console.log("finally " + this.state.accounts[0].accountNo)
      })
        .catch((error) => {
          console.error(error);
        });;
    }
    else {
      Alert.alert("Lütfen Giriş Yapınız!");
    }
    this.setState({ isDialogVisible: false });
  }
  onRefresh = async () => {
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
          <Text style={{ marginTop: 5, marginBottom: 5, fontSize: 18, marginLeft: Dimensions.get("window").width * 0.38 }}>Para Yatır</Text>

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
                    <Button title="Para Yatır" onPress={() => this.setState({ isDialogVisible: true, selectedAccountNo: item.accountNo })}></Button>
                  </View>
                </View>

              </TouchableWithoutFeedback>
            }
          />
          <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Para Yatır"}
            message={"Para Miktarını Giriniz"}
            hintInput={""}
            textInputProps={{ keyboardType: 'decimal-pad' }}
            submitInput={(inputText) => { this.toDepositMoney(inputText) }}
            closeDialog={() => this.setState({ isDialogVisible: false })}>
          </DialogInput>
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

export default DepositMoney;