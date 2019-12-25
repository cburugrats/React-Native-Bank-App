import React, { Component } from "react";
import { Platform, StyleSheet, View, Button, Picker, Alert, AsyncStorage, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default class Hgs extends Component {

  constructor() {
    super();
    this.state = {
      PickerSelectedVal: '',
      tcNumber: 0,
      selectedAccountNo: 0,
      accounts: [{ accountNo: 555, balance: 50 }],
      isLoading: true,
    }
  }


  getTc = async () => {

    await AsyncStorage.getItem('TcNo').then((value) => {
      this.setState({
        tcNumber: value
      })
      //alert(value)
    }).done();
  }

  listAccounts = () => {
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
  }


  registerHgs = async (balance, accountNo) => {
    if (this.state.tcNumber !== null) {
      console.log('tc: ' + this.state.tcNumber)
      let url = 'https://rugratswebapi.azurewebsites.net/api/account/withDrawMoney';
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
          Alert.alert("Başarıyla Para Çekildi!");
          this.listAccounts();
        }
        else if (deger == "0") {
          Alert.alert("Hesap Bulunamdı!");
        }
        else {
          console.log("kapatt : " + deger)
          alert("Para Çekme İşlemi Başarısız Oldu!");
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

  componentDidMount = () => {
    this.setState({
      tcNumber: this.getTc().finally(() => {
        this.listAccounts();
      })
    });

  }




  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ alignItems: "flex-start",  marginLeft: 16 }}
          onPress={this.props.navigation.openDrawer}
        >
          <FontAwesome5 name="bars" size={24} color="#161924" />
        </TouchableOpacity>
        <Button title="Hgs Hesabı Aç" style={{ marginBottom: 20 }} onPress={() => this.props.navigation.navigate('HgsRegister', { tcNumber: this.state.tcNumber })} />
        <Button title="Hgs Bakiyesi Sorgula" style={{ margin: 20 }} onPress={() => this.props.navigation.navigate('QueryHgs')} />
        <Button title="Hgs'ye Para Yatır" style={{ margin: 20 }} onPress={() => this.props.navigation.navigate('HgsDeposit')} />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
  },
  element: {
    margin: 5,
    borderWidth: 1,
    padding: 10,
    height: 50,
  },
});