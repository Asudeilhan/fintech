import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

const CustomSvg = () => {
  return (
     <View style={styles.svgContainer}>
            <Svg
              height= "200"
              width="100%"
              viewBox="0 0 1440 300"
              style={styles.svgWave}
            >
              <Path
                fill="#46257e"
                d="M0,192L40,186.7C80,181,160,171,240,149.3C320,128,400,96,480,74.7C560,53,640,43,720,64C800,85,880,139,960,170.7C1040,203,1120,213,1200,186.7C1280,160,1360,96,1400,64L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
              />
            </Svg>
          </View>
  )
}

export default CustomSvg

const styles = StyleSheet.create({
    svgContainer: {
        position: 'absolute',
        bottom: -58,
        width: '100%',
      },
      svgWave: {
        width: '100%',
        height: 200,
      },
})