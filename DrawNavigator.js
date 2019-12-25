import React from "react";

import { createAppContainer,createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from 'react-navigation-stack';

import {
    Dimensions,
    View,
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    AsyncStorage
} from "react-native";

import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import {
    ProfileScreen,
    MessageScreen,
    ActivityScreen,
    ListScreen,
    ReportScreen,
    StatisticScreen,
    SignOutScreen
} from "./Screens";

import Login from "./Screens/Login";

import Home from "./Screens/HomeScreen";

import Havale from "./Screens/Havale";

import MoneyTransferList from "./Screens/MoneyTransferList";

import Virman from "./Screens/Virman";

import VirmanRecieve from "./Screens/VirmanRecieve";

import Hgs from "./Screens/Hgs";

import QueryHgs from "./Screens/QueryHgs";

import HgsRegister from "./Screens/HgsRegister";

import HgsDeposit from "./Screens/HgsDeposit";

import CreditTransactions from "./Screens/CreditTransactions";

import Register from "./Screens/Deneme";

import SignOut from "./Screens/SignOut";

import Hidden from "./Screens/Hidden";

import AlertSc from "./Screens/AlertSc";

import DrawMoney from "./Screens/DrawMoney";

import DepositMoney from "./Screens/DepositMoney";

import SideBar from "./components/SideBar";

import ModalExample from "./Screens/ModalExample";

const LoginStack = createStackNavigator(
    {
        Login: {
            screen: Login,
        }
    }
);

LoginStack.navigationOptions = ({ navigation }) => {

    let drawerLockMode = 'locked-closed';
    return {
        drawerLockMode,
    };
};

const RegisterStack = createStackNavigator(
    {
        Register: {
            screen: Register,
        }
    }
);

const ListAccounts = createStackNavigator(
    {
        List: {
            screen: Home,
        }
    }
);

RegisterStack.navigationOptions = ({ navigation }) => {

    let drawerLockMode = 'locked-closed';
    return {
        drawerLockMode,
    };
};

const AuthStack = createStackNavigator({Login: LoginStack });

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._loadData();
    }

    render() {
        return(
            <View style={styles.container}>
                <ActivityIndicator/>
                <StatusBar barStyle="default"/>
            </View>
        );
    }

    _loadData = async() => {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        console.log("girddiiii")
        this.props.navigation.navigate(isLoggedIn >= '0'? 'Auth' : 'App')
    }
}

const DrawerNavigator = createDrawerNavigator(
    {
        Login: {
            screen: LoginStack,
            navigationOptions: {
                title: "EmptyScr",
                drawerLabel: <Hidden />
            }
        },
        Register: {
            screen: RegisterStack,
            navigationOptions: {
                title: "RegstScr",
                drawerLabel: <Hidden />
            }
        },
        HgsRegister: {
            screen: HgsRegister,
            navigationOptions: {
                title: "EmptyScr",
                drawerLabel: <Hidden />
            }
        },
        QueryHgs: {
            screen: QueryHgs,
            navigationOptions: {
                title: "EmptyScr",
                drawerLabel: <Hidden />
            }
        },
        HgsDeposit: {
            screen: HgsDeposit,
            navigationOptions: {
                title: "EmptyScr",
                drawerLabel: <Hidden />
            }
        },
        VirmanRecieve: {
            screen: VirmanRecieve,
            navigationOptions: {
                title: "EmptyScr",
                drawerLabel: <Hidden />
            }
        },
        Profil: {
            screen: ProfileScreen,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <Feather name="user" size={16} color={tintColor} />
            }
        },
        DrawMoney: {
            screen: DrawMoney,
            navigationOptions: {
                title: "Para Çek",
                drawerIcon: ({ tintColor }) => <MaterialIcons name="money-off" size={16} color={tintColor} />
            }
        },
        Activity: {
            screen: DepositMoney,
            navigationOptions: {
                title: "Para Yatır",
                drawerIcon: ({ tintColor }) => <MaterialIcons name="attach-money" size={16} color={tintColor} />
            }
        },
        List: {
            screen: Home,
            navigationOptions: {
                title: "Hesaplarım",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="account-details" size={16} color={tintColor} />
            }
        },
        Report: {
            screen: Havale,
            navigationOptions: {
                title: "Havale",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="bank-transfer" size={16} color={tintColor} />
            }
        },
        Message: {
            screen: Virman,
            navigationOptions: {
                title: "Virman",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="bank-transfer-out" size={16} color={tintColor} />
            }
        },
        MoneyTransferList: {
            screen: MoneyTransferList,
            navigationOptions: {
                title: "Para Transferleri",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="bank-transfer" size={16} color={tintColor} />
            }
        },
        Statistic: {
            screen: Hgs,
            navigationOptions: {
                title: "Hgs İşlemleri",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="highway" size={16} color={tintColor} />
            }
        },
        CrediTransactions: {
            screen: CreditTransactions,
            navigationOptions: {
                title: "Kredi  İşlemleri",
                drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="highway" size={16} color={tintColor} />
            }
        },
        SignOut: {
            screen: SignOut,
            navigationOptions: {
                title: "Çıkış Yap",
                drawerIcon: ({ tintColor }) => <Feather name="log-out" size={16} color={tintColor} />
            },
        }
    },
    {
        
        contentComponent: props => <SideBar { ...props} />,

        drawerWidth: Dimensions.get("window").width * 0.6,
        hideStatusBar: true,

        initialRouteName: 'List',
        contentOptions: {
            activeBackgroundColor: "rgba(212,118,207, 0.2)",
            activeTintColor: "#53115B",
            itemsContainerStyle: {
                marginTop: 16,
                marginHorizontal: 8
            },
            itemStyle: {
                borderRadius: 4
            }
        }
    }
);

export default createAppContainer(
    createSwitchNavigator(
      {
        AuthLoading: AuthLoadingScreen,
        App: DrawerNavigator,
        Auth: LoginStack,
      },
      {
        initialRouteName: 'Auth',
      }
    )
  );

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1e90ff',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });