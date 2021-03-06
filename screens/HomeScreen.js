import React, { Component } from "react";
import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { Permissions, Notifications } from "expo";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setExpoPushToken } from "../store/actions/notifiActions";
import { MenuItem, Upcoming } from "../components/home";
import Gradients from "../constants/Gradients";
import Colors from "../constants/Colors";
import ProductSans from "../constants/fonts/ProductSans";

class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    logOut: PropTypes.func,
    setExpoPushToken: PropTypes.func,
    authError: PropTypes.string,
    user: PropTypes.object
  };

  componentDidMount() {
    const { user } = this.props;

    if (!user.isEmpty) {
      // User is present
      if (!user.expoPushToken) {
        // Token is not present and should be set
        this.registerForPushNotifications();
      }
    }
  }

  registerForPushNotifications = async () => {
    const { user } = this.props;

    //Check for excisting permissions
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = status;

    //If no excisting permission, ask for permission
    if (status !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    //If no permission, exit the function
    if (finalStatus !== "granted") return;

    //Get push notification token
    let token = await Notifications.getExpoPushTokenAsync();

    if (user.uid && token) {
      this.props.setExpoPushToken(user.uid, token);
    }
  };

  defineGreeting = hours => {
    // Get correct greeting defined by current hour
    switch (true) {
      case hours >= 18:
        return "Goedenavond";
      case hours >= 12:
        return "Goedemiddag";
      case hours >= 6:
        return "Goedemorgen";
      default:
        return "Goededag";
    }
  };

  getFirstName = displayName => {
    // Get first name or leave blank
    return displayName ? displayName.split(" ")[0] : "";
  };

  render() {
    const { navigation, user } = this.props;

    return (
      <ScrollView>
        <Text style={styles.intro}>
          {this.defineGreeting(new Date().getHours())} {this.getFirstName(user.displayName)}
        </Text>
        <TouchableOpacity
          style={styles.profileContainer}
          activeOpacity={0.6}
          onPress={() => navigation.navigate("Profile")}
        >
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.photoURL} />
          ) : (
            <Image source={require("../assets/images/home/no-profile.jpg")} style={styles.photoURL} />
          )}
        </TouchableOpacity>
        <View style={styles.menuItemContainer}>
          <Upcoming
            img={require("../assets/images/icon/home/medicatie.png")}
            gradientColor={Gradients.blue}
            onPress={() => navigation.navigate("Medicines")}
          />
          <MenuItem
            title="Medicijnen"
            img={require("../assets/images/icon/home/medicatie.png")}
            gradientColor={Gradients.blue}
            onPress={() => navigation.navigate("Medicines")}
          />
          <MenuItem
            title="Oefeningen"
            img={require("../assets/images/icon/home/oefeningen.png")}
            gradientColor={Gradients.green}
            onPress={() => navigation.navigate("Exercises")}
          />
          <MenuItem
            title="Activiteiten"
            img={require("../assets/images/icon/home/activiteiten.png")}
            gradientColor={Gradients.orange}
          />
          <MenuItem
            title="Community"
            img={require("../assets/images/icon/home/community.png")}
            gradientColor={Gradients.pink}
          />
          <MenuItem
            title="Tips & Tricks"
            img={require("../assets/images/icon/home/tipsTricks.png")}
            gradientColor={Gradients.purple}
          />
          <MenuItem
            title="Schema"
            img={require("../assets/images/icon/home/schema.png")}
            gradientColor={Gradients.yellow}
            onPress={() => navigation.navigate("Schema")}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 7,
    alignSelf: "baseline",
    flexWrap: "wrap",
    flexBasis: "45%",
    flexGrow: 1
  },
  text: {
    color: Colors.white,
    fontFamily: ProductSans.bold,
    marginTop: 5
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10
  },
  gradient: {
    elevation: 5,
    padding: 25,
    alignItems: "center",
    borderRadius: 10
  },
  intro: {
    fontSize: 28,
    color: Colors.greyTextColor,
    fontFamily: ProductSans.bold,
    marginTop: 60,
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20
  },
  profileContainer: {
    position: "absolute",
    top: 59.5,
    right: 15,
    width: 36,
    height: 36
  },
  photoURL: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  menuItemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingLeft: 10,
    paddingRight: 10
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.firebase.profile
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...ownProps,
    setExpoPushToken: (uid, token) => {
      dispatch(setExpoPushToken(uid, token));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
