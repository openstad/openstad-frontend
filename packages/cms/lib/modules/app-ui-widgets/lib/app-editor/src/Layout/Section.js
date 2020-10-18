import React, { Component } from 'react';
import './Layout.css';

class Section extends Component {

  constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  render() {
    var className = this.state.open ? 'section open' : 'section';

    return (
      <div className={className}>
        <a href="#" className="section-header" onClick={() => {
          this.setState({
            open: !this.state.open
          })
        }}>
          <h3 className=""> {this.props.title} </h3>
          {this.props.collabsable && <a href="#" className="section-" > > </a>}
        </a>
        <div class="section-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Section;
