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

function createNewRowData(name, summary, total_sets, total_time_mins) {
  var newData = {
    name: name,
    summary: summary,
    total_sets: total_sets,
    total_time_mins: total_time_mins
  };
  return newData;
}

var columnDefs = [{
    headerName: "Name", field: "name", editable: true
  }, {
    headerName: "Summary", field: "summary", editable: true
  }, {
    headerName: "Total Sets", field: "total_sets", editable: true, resizable: true, width: convertRemToPixel(remInPixel) * 2
  },
  {
    headerName: "Total Minutes Recorded", field: "total_time_mins", editable: true, resizable: true, width: convertRemToPixel(remInPixel) * 2
}];

var gridOptions = {
  columnDefs: columnDefs,
  rowSelection: 'single',
  rowData: [],
  onSelectionChanged: onSelectionChanged
};

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      routines: [],
    };

  }


  componentDidMount() {
    this.setState({ loading: false });

    this.props.firebase.routines().get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { name, summary, total_sets, total_time_mins } = doc.data();
        console.log(doc.data())
        this.state.routines.push({
          key: doc.id,
          doc, // DocumentSnapshot
          name,
          summary,
          total_sets,
          total_time_mins
        });
        var newRecord = createNewRowData(name, summary, total_sets, total_time_mins)
        gridOptions.api.updateRowData({add: [newRecord]});
      });

    });
    /*
    this.props.firebase.exercises().on('value', snapshot => {
      const exercisesObject = snapshot.val();

      console.log(exercisesObject);

      const exerciseList = Object.keys(exercisesObject).map(key => ({
        ...exercisesObject[key],
        uid: key,
      }));

      console.log(exerciseList);

      this.setState({
        exercises: exerciseList,
        loading: false,
      });
    });*/
  }

  componentWillUnmount() {
  }



  render() {
    const { loading } = this.state;


    return (
      <div>
        <h1>Routines</h1>

        {loading && <div>Loading ...</div>}

        <RoutineList gridOptions={gridOptions}  />
      </div>
    );
  }
}

const RoutineList = ({ gridOptions }) => (
  <div className="row">
    <div
    className="ag-theme-material col-12"
    style={{
      height: '500px' }}>
      <AgGridReact gridOptions={gridOptions}></AgGridReact>
    </div>
  </div>
);

export default withFirebase(withAuthorization(condition)(AdminPage));
