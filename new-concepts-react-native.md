location: android/app/src/main/res/values/styles.xml

  <!-- Prevent Android from displaying a temporary window preview before the app's UI is ready. -->

<item name="android:windowDisablePreview">true</item>

location:index.js
--> defaultProps

Google fetch places API -> 'https://places.googleapis.com/v1/places:autocomplete',

RESPONSE:
const data = {
suggestions: [
{
placePrediction: {
place: "places/EkxTdGFyIFNxdWFyZSwgVmlqYXkgTmFnYXIsIFNjaGVtZSAxMzQsIE5pcGFuaWEsIEluZG9yZSwgTWFkaHlhIFByYWRlc2gsIEluZGlhIi4qLAoUChIJRfobHKLiYjkRLPg-BW7N6QYSFAoSCY8E5SOf4mI5EYXoG9HVd_SR",
placeId:
"EkxTdGFyIFNxdWFyZSwgVmlqYXkgTmFnYXIsIFNjaGVtZSAxMzQsIE5pcGFuaWEsIEluZG9yZSwgTWFkaHlhIFByYWRlc2gsIEluZGlhIi4qLAoUChIJRfobHKLiYjkRLPg-BW7N6QYSFAoSCY8E5SOf4mI5EYXoG9HVd_SR",
text: {
text: "Star Square, Vijay Nagar, Scheme 134, Nipania, Indore, Madhya Pradesh, India",
matches: [{ endOffset: 4 }],
},
structuredFormat: {
mainText: {
text: "Star Square",
matches: [{ endOffset: 4 }],
},
secondaryText: {
text: "Vijay Nagar, Scheme 134, Nipania, Indore, Madhya Pradesh, India",
},
},
types: ["geocode", "route"],
},
},

    {
      placePrediction: {
        place: "places/ChIJ4TW6AeUZDTkRgMpMr8OO82Q",
        placeId: "ChIJ4TW6AeUZDTkRgMpMr8OO82Q",
        text: {
          text: "Star Mall, Block A, Sector 30, Gurugram, Haryana, India",
          matches: [{ endOffset: 4 }],
        },
        structuredFormat: {
          mainText: {
            text: "Star Mall",
            matches: [{ endOffset: 4 }],
          },
          secondaryText: {
            text: "Block A, Sector 30, Gurugram, Haryana, India",
          },
        },
        types: ["establishment", "shopping_mall", "point_of_interest"],
      },
    },

    {
      placePrediction: {
        place: "places/ChIJ5cxJNFKf-DkRkSd1DUW3w14",
        placeId: "ChIJ5cxJNFKf-DkRkSd1DUW3w14",
        text: {
          text: "Star Mall, Jessore Rd, Sisir Kunja, Barasat, Madhyamgram, Kolkata, West Bengal, India",
          matches: [{ endOffset: 4 }],
        },
        structuredFormat: {
          mainText: {
            text: "Star Mall",
            matches: [{ endOffset: 4 }],
          },
          secondaryText: {
            text: "Jessore Rd, Sisir Kunja, Barasat, Madhyamgram, Kolkata, West Bengal, India",
          },
        },
        types: ["point_of_interest", "establishment", "shopping_mall"],
      },
    },

    {
      placePrediction: {
        place: "places/ChIJ6yaD0FGVyzsRv05FHXTKH2I",
        placeId: "ChIJ6yaD0FGVyzsRv05FHXTKH2I",
        text: {
          text: "Star Multi-Speciality Hospitals, Financial District, Nanakramguda, Hyderabad, Telangana, India",
          matches: [{ endOffset: 4 }],
        },
        structuredFormat: {
          mainText: {
            text: "Star Multi-Speciality Hospitals",
            matches: [{ endOffset: 4 }],
          },
          secondaryText: {
            text: "Financial District, Nanakramguda, Hyderabad, Telangana, India",
          },
        },
        types: [
          "health",
          "hospital",
          "establishment",
          "service",
          "point_of_interest",
        ],
      },
    },

    {
      placePrediction: {
        place: "places/ChIJB0OZcLOWyzsRUlrYGRVBEWI",
        placeId: "ChIJB0OZcLOWyzsRUlrYGRVBEWI",
        text: {
          text: "Star Hospitals - Block A & C | MultiSpeciality Hospital in Banjara Hills, Road Number 10, Gaffar Khan Colony, Banjara Hills, Hyderabad, Telangana, India",
          matches: [{ endOffset: 4 }],
        },
        structuredFormat: {
          mainText: {
            text: "Star Hospitals - Block A & C | MultiSpeciality Hospital in Banjara Hills",
            matches: [{ endOffset: 4 }],
          },
          secondaryText: {
            text: "Road Number 10, Gaffar Khan Colony, Banjara Hills, Hyderabad, Telangana, India",
          },
        },
        types: [
          "establishment",
          "health",
          "service",
          "point_of_interest",
          "hospital",
        ],
      },
    },

],
};
