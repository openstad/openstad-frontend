import theme from '../theme';

const fontFamily = 'Source Sans Pro, sans-serif';

const styles = {
  h1 : {
    fontSize: 16,
    display: 'block',
    color: theme.emphasisedTextColor,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: fontFamily
  },
  h2 : {
    fontSize: 14,
    display: 'block',
    color: theme.primaryColor,
    fontFamily: fontFamily,
    fontWeight: 'bold'
  },
  p  : {
    fontSize: 12,
    display: 'block',
    color: theme.defaultTextColor,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: fontFamily
  },
  small : {
    fontSize: 11,
    color: theme.emphasisedTextColor,
    fontFamily: fontFamily
  },
  greyBackground : {
    background: theme.backgroundColor
  },
  whiteBackground : {
    background: '#FFFFFF'
  },
  contentContainer : {
    padding: 15
  },
  timelineContainer: {
    paddingLeft: 30
  },
  timeline : {
    position: 'absolute',
    width: 2,
    top: 25,
    left: 15,
    bottom: 15,
    background: theme.primaryColor
  },
  outlinedButton: {
    color: theme.primaryColor,
    backgroundColor: 'transparant',
    borderColor: theme.primaryColorLighter,
    fontWeight: 'bold',
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 8,
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fontFamily
  },
  colContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  colFifty: {
    width: '50%',
  },
  colThird: {
    width: '33.333%',
    paddingRight: 10
  },
  noPreWrap: {
    whiteSpace: 'normal'
  },
  close: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 5
  }
}

export default styles;
