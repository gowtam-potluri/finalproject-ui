import React from 'react';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger, Table,
} from 'react-bootstrap';
import graphQLFetch from './graphQLFetch.js';
import UserContext from './UserContext.js';



// eslint-disable-next-line react/prefer-stateless-function
class IssueRowPlain extends React.Component {
  
  constructor() {
    super();
    this.state = { username1: 'empty' };
  }

  componentDidMount() {
   
    const query = `query { user {
      signedIn givenName
    }}`;
    const data =   graphQLFetch(query, null, null);
      data.then(json => this.setState({ username1: json }));
  
  }
  

  render() {
    
    

    
    const {
      issue, location: { search }, closeIssue, deleteIssue, index,
    } = this.props;
    const user = this.context;
    const disabled = !user.signedIn;


    const selectLocation = { pathname: `/patients/${issue.id}`, search };
    const editTooltip = (
      <Tooltip id="close-tooltip" placement="top">Edit Issue</Tooltip>
    );
    const closeTooltip = (
      <Tooltip id="close-tooltip" placement="top">Close Issue</Tooltip>
    );
    const deleteTooltip = (
      <Tooltip id="delete-tooltip" placement="top">Delete Issue</Tooltip>
    );

    function onClose(e) {
      e.preventDefault();
      closeIssue(index);
    }
    function onDelete(e) {
      e.preventDefault();
      deleteIssue(index);
    }

    
    const tableRow = (
      <tr>
        <td>{issue.id}</td>
        <td>{issue.helpreq}</td>
        <td>{issue.name}</td>
        <td>{issue.created.toDateString()}</td>
        <td>{issue.quantity}</td>
        <td>{issue.username}</td>
        <td>{issue.district}</td>
         { this.state.username1!="empty" && this.state.username1.user.givenName == issue.username &&
        <td>
          
          <LinkContainer to={`/patedit/${issue.id}`}>
            <OverlayTrigger delayShow={1000} overlay={editTooltip}>
              <Button bsSize="xsmall">
                <Glyphicon glyph="edit" />
              </Button>
            </OverlayTrigger>
          </LinkContainer>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={closeTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onClose}>
              <Glyphicon glyph="remove" />
            </Button>
          </OverlayTrigger>
          {' '}
          <OverlayTrigger delayShow={1000} overlay={deleteTooltip}>
            <Button disabled={disabled} bsSize="xsmall" onClick={onDelete}>
              <Glyphicon glyph="trash" />
            </Button>
          </OverlayTrigger>
        </td>
       }
      </tr>
    );

    return (
      <LinkContainer to={selectLocation}>
        {tableRow}
      </LinkContainer>
    );
  }
}

IssueRowPlain.contextType = UserContext;
const IssueRow = withRouter(IssueRowPlain);
delete IssueRow.contextType;

export default function IssueTable({ issues, closeIssue, deleteIssue }) {
  const issueRows = issues.map((issue, index) => (
    <IssueRow
      key={issue.id}
      issue={issue}
      closeIssue={closeIssue}
      deleteIssue={deleteIssue}
      index={index}
    />
  ));

  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Help Required</th>
          <th>Name</th>
          <th>Created</th>
          <th>Quantity</th>
          <th>Phone</th>
          <th>District</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </Table>
  );
}