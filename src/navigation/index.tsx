// src/navigation/index.tsx (or wherever your file lives)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import BillboardScreen from "../screens/BillboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";         
import { AuthProvider, useAuth } from "../context/AuthContext"; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Your existing tabs extracted as a component
function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1DB954", // Spotify green
                tabBarStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Billboard"
                component={BillboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="musical-notes" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Decides whether to show Login or Tabs
function RootGate() {
    const { accessToken, loading } = useAuth();

    if (loading) {
        // Optional: render a splash/loading component here
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {accessToken ? (
                <Stack.Screen name="App" component={Tabs} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
}

// Export the app navigation wrapped in AuthProvider
export default function RootNavigator() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootGate />
            </NavigationContainer>
        </AuthProvider>
    );
}
