export const handleFitToPath = (
  mapRef: any,
  deliveryLocation: any,
  pickupLocation: any,
  deliveryPersonLocation: any,
  hasPickedUp: boolean,
  hasAccepted: boolean,
) => {
  if (mapRef && deliveryLocation && pickupLocation) {
    mapRef.fitToCoordinates(
      [
        hasAccepted ? deliveryPersonLocation : deliveryLocation,
        hasPickedUp ? deliveryPersonLocation : pickupLocation,
      ],
      {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      },
    );
  }
};
