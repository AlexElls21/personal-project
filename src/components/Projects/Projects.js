import React, { Component } from 'react';
import NavBar from '../NavBar/NavBar';
import './Projects.css';
import { getProjects } from '../..//ducks/reducer';
import { connect } from 'react-redux';
import axios from 'axios';


class Projects extends Component {
    constructor(){
        super()
        this.state ={
            editPost: null,
            inputComment: '',
            inputTitle: '',
            addedComment:'',
            addedTitle:'',
            addedImg:'',
            userId: null
        }
        this.onSave = this.onSave.bind(this);
        this.addNew = this.addNew.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    componentDidMount(){
        const{getProjects} = this.props;
        axios.get('http://localhost:3013/projects/img').then( res => {
            // console.log(res.data)
            getProjects(res.data)
        })
    }

    onSave(id){
        console.log('Hello')
        axios.put(`http://localhost:3013/update/project/${id}`, {
            title: this.state.inputTitle,
            comment: this.state.inputComment
        })
        .then(res => {console.log(res)})
    }

    addNew(){
        axios.post(`http://localhost:3013/new/project`, {
            title: this.state.addedTitle,
            comment: this.state.addedTitle,
            img: this.state.addedImg,
            id: this.state.userId
        })
        .then(res => {console.log(res)})
    }

    deletePost(id){
        axios.delete(`http://localhost:3013/remove/project/${id}`).then(res => {console.log('deleted')})
    }

    

    render() {
        // console.log(this.props.users[0].id)
        console.log(this.state.inputComment, this.state.inputTitle)
        console.log('Comment: ' + this.state.addedComment, 'img: ' + this.state.addedImg,'Title: ' + this.state.addedTitle, 'User: ' + this.state.userId)
        return (
            <div>
                <div className='heroProjects'>
                    <NavBar />
                    <div className='headerProjects'>
                        <h1>Current projects we're working on</h1>
                    </div>
                </div>
                
                {this.props.users.length ? 
                //ADMIN BUT NOT EDITING 
                 this.props.projects.map((item, i) => {
                    console.log(this.state.editPost)
                        if (this.state.editPost !== item.id) { return <div key={i}>
                            <h1>YOURE AN ADMIN and not editing</h1>
                            <h1 className='project-header'>{item.title}</h1>
                                <div className='project'>
                                    <div>
                                        <img className='project1' src={item.img} alt="" />
                                    </div>
                                    <h3 className='project-info'>{item.comment_section}</h3>
                                </div>
                                <button onClick={ () => {
                                    this.setState({
                                        editPost: item.id,
                                        inputComment: item.comment_section,
                                        inputTitle: item.title})}}>EDIT</button>
                                <button onClick={ ()=> {this.deletePost(item.id)}}>DELETE</button>
                        </div>}
                         else { 
                             //ADMIN EDITING
                            return <div key={i}>
                            <h1>YOURE AN ADMIN and you are editing</h1>
                            <input type='text' value={this.state.inputTitle} className='project-header' onChange={ (en) => {
                                this.setState({
                                    inputTitle: en.target.value
                                })
                            }}></input>
                                <div className='project'>
                                    <div>
                                        <img className='project1' src={item.img} alt="" />
                                    </div>
                                    <input type='text' value={this.state.inputComment} className='project-info' onChange={ (e) => {
                                        this.setState({
                                            inputComment: e.target.value
                                        })
                                    }}></input>
                                </div>
                                    {/* EDIT BUTTON */}
                                <button onClick={ () => {
                                    console.log(this.props)
                                    this.setState({
                                        editPost: item.id,
                                        inputComment: item.comment_section,
                                        inputTitle: item.title,
                                        userId: this.props.users[0].id
                                    })}}>EDIT
                                </button>
                                {/* SAVE BUTTON */}
                                <button onClick={() => {this.onSave(item.id)}}>SAVE</button>
                                {/* NEW PROJECT */}
                                <h3>Add New Project</h3>
                                <input type="text" placeholder='Title' onChange={ (a) =>{
                                    this.setState({
                                        addedTitle: a.target.value
                                    })
                                }} />
                                <input type="text" placeholder='Comment' onChange={ (b) => {
                                    this.setState({
                                        addedComment: b.target.value
                                    })
                                }} />
                                <input type="text" placeholder='img url' onChange={ (c) => {
                                    this.setState({
                                        addedImg: c.target.value
                                    })
                                }} />
                                <button onClick={() => {this.addNew(this.props.users[0].id)}}>ADD</button>

                        </div>

                        }
                })
                    : 
                    //JUST A USER VIEWING THE PAGE
                    this.props.projects.map((item, i) => {
                    console.log(item)
                        return <div key={i}>
                            <h1 className='project-header'>{item.title}</h1>
                                <div className='project'>
                                    <div>
                                        <img className='project1' src={item.img} alt="" />
                                    </div>
                                    <h3 className='project-info'>{item.comment_section}</h3>
                                </div>
                        </div>
                })  }
            </div>
        )
    }
}


function mapStateToProps(state) {
    if (!state) return {};
    return {projects: state.projects,
            users: state.users};
  }


  export default connect(mapStateToProps, {getProjects})(Projects)