import React from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { check } from "../../utils/authHelper";
import camelize from "../../utils/camelize";

import UserManagement from '../../views/Users';
import Overview from '../../views/Dashboard/Overview';
import VehicleManagement from '../../views/Vehicles/Vehicles'
import VehicleService from '../../views/VehicleServices/VehicleServices';
import DeviceManagement from '../../views/Units/Units';
import DriverRegistration from '../../views/Drivers/Drivers';
import UnitTypeMaster from '../../views/UnitTypes/UnitTypes';
import AlarmTypeMaster from '../../views/AlarmTypes/AlarmTypes'
import UserGroups from '../../views/UserGroups/UserGroups'


const TAB_CONTENT = {
  'Dashboard': Overview,
  UserManagement,
  VehicleManagement,
  VehicleService,
  DeviceManagement,
  DriverRegistration,
  UnitTypeMaster,
  AlarmTypeMaster,
  UserGroups
}

class Tabs extends React.PureComponent {

  state = {
    activeTab: this.props.tabItems.length > 0 ? this.props.tabItems[0].name : '',
    isScrollEnable: false,
    disabled: true
  }

  componentWillReceiveProps(newProps) {
    if(newProps.customerId !== this.props.customerId) {
      this.setState({
        activeTab: 'Dashboard'
      })
    }
  }

  componentDidMount() {
    this.checkIsNavigationScroll();
    window.addEventListener('resize', () => this.checkIsNavigationScroll());
  }

  checkIsNavigationScroll() {
    let el = document.getElementById('top-nav');
    var isScroll = el.clientWidth < el.scrollWidth
    this.setState({
      isScrollEnable: isScroll
    });
  }


  handleToggle = (activeTab) => {
    this.setState({
      activeTab,
      disabled: activeTab !== this.state.activeTab
    })
  }

  enableTabs = () => {
    this.setState({
      disabled: false
    })
  }

  scrollWin = (type) => {
    let navigationBar = document.getElementById('top-nav');
    if (type == 'left')
      navigationBar.scrollLeft -= 100;
    else if (type == 'right')
      navigationBar.scrollLeft += 100;
    else navigationBar.scrollLeft = 0
  }
  render() {
    const {tabItems, customerId} = this.props
    const {activeTab} = this.state
    return (<>
      <div className="scroll">
        {this.state.isScrollEnable && <span onClick={() => this.scrollWin('left')} className="fa fa-angle-left slideArrow" />}
        <Nav tabs id="top-nav">
          {tabItems.map((item, key) => {
            let tabs = []
            if(TAB_CONTENT[camelize(item.name)] && check(item.permission)) {
              tabs.push(
                <NavItem key={key}>
                  <NavLink
                    className={classnames({ active: activeTab === item.name })}
                    onClick={() => { this.handleToggle(item.name); }}
                    disabled={this.state.disabled}
                  >
                    {item.name}
                  </NavLink>
                </NavItem>
              );
            }
             if(item.name == 'General' && check(item.permission)){
               item.children.map((children, key)=>{
                if(TAB_CONTENT[camelize(children.name)] && check(children.permission)){
                 
                  tabs.push(
                    <NavItem key={key}>
                    <NavLink
                      className={classnames({ active: activeTab === children.name })}
                      onClick={() => { this.handleToggle(children.name); }}
                      disabled={this.state.disabled}
                    >
                      {children.name}
                    </NavLink>
                  </NavItem>
                );
                }
               })
            }
            if(item.name == "User Management" && check(item.permission)){
               item.children.map((children, key)=>{
                if(TAB_CONTENT[camelize(children.name)] && check(children.permission)){
                 
                  tabs.push(
                    <NavItem key={key}>
                    <NavLink
                      className={classnames({ active: activeTab === children.name })}
                      onClick={() => { this.handleToggle(children.name); }}
                      disabled={this.state.disabled}
                    >
                      {children.name}
                    </NavLink>
                  </NavItem>
                );
                }
               })
            }
            return tabs;

          })}
        </Nav>
        {this.state.isScrollEnable && <span onClick={() => this.scrollWin('right')} className="fa fa-angle-right slideArrow" />}
      </div>

      <TabContent activeTab={activeTab}>
        {tabItems.map((item, key) => {
          let Tab = TAB_CONTENT[camelize(item.name)]
          let tabs = []
          if(Tab && check(item.permission) && activeTab === item.name) {
            tabs.push(<TabPane tabId={item.name} key={key}>
              <Tab
                customerId={customerId}
                enableTabs={this.enableTabs}
                handleToggle={this.handleToggle}
              />
            </TabPane>)
          }
          if(item.name == 'General' && check(item.permission)){
               item.children.map((children, key)=>{
                let Tab = TAB_CONTENT[camelize(children.name)]
                if( Tab && check(children.permission) && activeTab === children.name){
                  
                  tabs.push(<TabPane tabId={children.name} key={key}>
                    <Tab
                      customerId={customerId}
                      enableTabs={this.enableTabs}
                    />
                  </TabPane>)
                }
               })
            
            }
            if(item.name == 'User Management' && check(item.permission)){
               item.children.map((children, key)=>{
                let Tab = TAB_CONTENT[camelize(children.name)]
                if( Tab && check(children.permission) && activeTab === children.name){
                  
                  tabs.push(<TabPane tabId={children.name} key={key}>
                    <Tab
                      customerId={customerId}
                      enableTabs={this.enableTabs}
                    />
                  </TabPane>)
                }
               })
            
            }
            return tabs;
        })}


      </TabContent>
    </>);
  }

};

export default Tabs;
