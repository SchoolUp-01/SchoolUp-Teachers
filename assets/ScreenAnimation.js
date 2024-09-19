export const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
export const fadeAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        opacity: current.progress,
        // transform: [
        //   {
        //     translateX: current.progress.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [layouts.screen.width, 0],
        //     }),
        //   },
        // ],
      },
    };
  },
};
export const noAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        opacity: 1,
        // transform: [
        //   {
        //     translateX: current.progress.interpolate({
        //       inputRange: [0, 1],
        //       outputRange: [layouts.screen.width, 0],
        //     }),
        //   },
        // ],
      },
    };
  },
};
