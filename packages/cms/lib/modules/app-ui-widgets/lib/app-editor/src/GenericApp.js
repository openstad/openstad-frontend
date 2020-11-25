

class GenericAppLayout extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    )
  }
}

screen = {
  type: resource|static|login,
  resourceType:
  id:

}

class GenericApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStepId: null,
    };

  }

  handleHashChange() {
    var location =  window.location;
    var hash = location.hash;
    var activeStepId;

    if (hash.startsWith('#step-detail')) {
      activeStepId = parseInt(hash.replace('#step-detail-', ''), 10);
    }

    this.setState({
      activeStepId: activeStepId
    }) ;
  }

  render() {
    return (
      <div>
        <Switch>
          {this.props.screens.map((screen) => {
            const path = screen.type === 'resource' ? `/${screen.resourceType}/:resourceId` : `/page/${screen.id}`;

            <Route path="/about">
              <About />
            </Route>
          })

        </Switch>
      </div>
    )
  }
}

export default GenericApp=;
