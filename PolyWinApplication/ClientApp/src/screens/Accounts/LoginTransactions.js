import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { bindActionCreators } from "redux";
import { Form, Button } from 'react-bootstrap';
import Confirme from '../Confirme/Confirme';
import ReactTable from '../renderData/renderData';
import toastr from 'toastr';
import '../../Design/CSS/custom.css';



class LoginTransaction extends Component {

    constructor(props) {
        super(props);
        let userType = JSON.parse(sessionStorage.getItem("UserType"));
        if (userType !== 1) {
            toastr.error("عفوا ليس لديك صلاحية لهذة الصفحة");
            this.props.history.push("/Login");
        }
        // this is columns of Department
        this.cells = [
            {
                Header: <strong> الأسم </strong>,
                accessor: 'accountName',
                width: 200,
                filterable: true,
            },
            {
                Header: <strong> المحافظة</strong>,
                accessor: 'governorate',
                width: 150,
                filterable: true,
            }, {
                Header: <strong>نوع الحساب</strong>,
                accessor: 'userType',
                width: 150,
                filterable: true,
            },

            {
                Header: <strong> رقم الهاتف </strong>,
                accessor: 'phone',
                width: 150,
                filterable: true,
            },
            {
                Header: <strong>تاريخ الدخول</strong>,
                accessor: 'loginDate',
                width: 150,
                filterable: true,
            } 
        ];

        // initial value of state

        this.state = {
            selected: [],
            isLoading: false,
            showConfirme: false,
            _showConfirme: false
        }
    }
     
    // life cycle of react calling when page is loading
    componentDidMount() {
        this.props.actions.loginTransaction();
    }
      
    // this function when leave from page
    componentWillUnmont() {
        this.setState({
            show: false,
            isLoading: false,
            showConfirme: false
        });
    }

 
    render() {

        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="breadcrumb-holder">
                                    <h1 className="main-title float-left">متابعة الدخول على البرنامج</h1>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        <br />
                        {/* List Of Data */}
                        <ReactTable
                            data={this.props.ListLoginTransaction}
                            columns={this.cells}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    ListLoginTransaction: state.reduces.ListLoginTransaction
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginTransaction);