import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

import { AgGridReact } from 'ag-grid-react';


const condition = authUser => !!authUser;

const remInPixel = parseFloat(getComputedStyle(document.documentElement).fontSize);
const convertRemToPixel = (rem) => rem * remInPixel;


function onSelectionChanged() {
  var selectedRows = this.gridOptions.api.getSelectedRows();
  selectedRows.forEach(function (selectedRow, index) {
    console.log(selectedRow, index)
  });
}


class WorkoutRoutinesPage extends Component {
  constructor(props) {
    super(props);

    function onRowValueChanged(params) {
      props.firebase.routines().doc(params.data.key).set(
        {
          "name": params.data.name,
          "summary": params.data.summary,
          "total_sets": params.data.total_sets,
          "total_time_mins": params.data.total_time_mins
        }
      ).then(function() {
        console.log("Document successfully written!");
      }).catch(function(error) {
        console.error("Error writing document: ", error);
      });
    }

    this.state = {
      loading: true,
      routines: [],
      gridOptions: {
        columnDefs: [{
          headerName: "Name", field: "name", editable: true
        }, {
          headerName: "Summary", field: "summary", editable: true, width: convertRemToPixel(remInPixel)
        }, {
          headerName: "Total Sets", field: "total_sets", editable: true, resizable: true
        },
          {
            headerName: "Total Minutes Recorded", field: "total_time_mins", editable: true, resizable: true, width: convertRemToPixel(remInPixel)
          }],
        rowSelection: 'single',
        onRowValueChanged: onRowValueChanged,
        editType: 'fullRow'
      }
  };
    this.onAddRoutine = this.onAddRoutine.bind(this);
    this.onDeleteRoutine = this.onDeleteRoutine.bind(this);
  }


  componentDidMount() {
    this.setState({ loading: true });

    const routines = this.state.routines;

    this.props.firebase.routines().get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { name, summary, total_sets, total_time_mins } = doc.data();
        console.log(doc.data());
        routines.push({
          key: doc.id,
          doc, // DocumentSnapshot
          name,
          summary,
          total_sets,
          total_time_mins
        });

        this.setState({
          loading: false,
          routines: routines
        });

        this.state.gridOptions.api.setRowData(this.state.routines);
      });

    });
  }

  componentWillUnmount() {
  }


  // in onGridReady, store the api for later use
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.api.setRowData(this.state.routines);
  };

  onAddRoutine() {
    const new_record = {'name': 'New Routine', "summary": "Please Add", "total_sets": 0, 'total_time_mins': 0};
    this.props.firebase.routines().add(new_record
    ).then((docRef) => {
      console.log("Document successfully written!");
      new_record.key = docRef.id;
      new_record.doc = docRef;
      this.state.gridOptions.api.updateRowData({add: [new_record]});
    }).catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

  onDeleteRoutine() {
    var selectedData = this.state.gridOptions.api.getSelectedRows();
    const key = selectedData[0].key; // theres always only one selected row
    this.props.firebase.routines().doc(key).delete()
      .then((docRef) => {
      console.log("Document successfully deleted!");
      this.state.gridOptions.api.updateRowData({remove: selectedData});
    }).catch((error) => {
      console.error("Error deleting document: ", error);
    });
  }


  render() {
    const { loading } = this.state;

    return (
      <div>
        <h1>Routines</h1>

        {loading && <div>Loading ...</div>}

        <div className="row">
          <div
            className="ag-theme-material col-12"
            style={{
              height: '500px' }}>

            <button onClick={this.onAddRoutine}>Add Routine</button>
            <button onClick={this.onDeleteRoutine}>Delete Selected Routine</button>

            <AgGridReact onGridReady={this.onGridReady} gridOptions={this.state.gridOptions}></AgGridReact>
          </div>
        </div>

      </div>
    );
  }
}

export default withFirebase(withAuthorization(condition)(WorkoutRoutinesPage));
