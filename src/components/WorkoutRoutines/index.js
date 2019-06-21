import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

const condition = authUser => !!authUser;

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      exercises: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.exercises().get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().name}`);
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
    this.props.firebase.exercises().off();
  }

  render() {
    const { exercises, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}

        <ExercisesList exercises={exercises} />
      </div>
    );
  }
}

const ExercisesList = ({ exercises }) => (
  <ul>
    {exercises.map(exercise => (
      <li key={exercise.uid}>
        <span>
          <strong>ID:</strong> {exercise.name}
        </span>
        <span>
          <strong>E-Mail:</strong> {exercise.name}
        </span>
        <span>
          <strong>Username:</strong> {exercise.name}
        </span>
      </li>
    ))}
  </ul>
);

export default withFirebase(withAuthorization(condition)(AdminPage));
