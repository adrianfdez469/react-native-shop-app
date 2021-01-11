import React, {FC} from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Platform } from 'react-native'

const CustomHeaderButton:FC = props => {

    return <HeaderButton 
        title=""
        {...props} 
        IconComponent={Ionicons} 
        iconSize={23}
        color={Platform.OS === "android" ? 'white' : Colors.primary}  
    />
}
export default CustomHeaderButton;