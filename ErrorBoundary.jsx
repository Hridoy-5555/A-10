import React from "react";

class ErrorBoundary extends React.Component {

constructor(props){
super(props);

this.state={
hasError:false
};

}

static getDerivedStateFromError(error){

return{
hasError:true
};

}

componentDidCatch(error,errorInfo){

console.error(error,errorInfo);

}

render(){

if(this.state.hasError){

return(

<div style={{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
flexDirection:"column"
}}>

<h1>Something went wrong.</h1>

<button
onClick={()=>window.location.reload()}
style={{
padding:"12px 25px",
marginTop:"20px",
cursor:"pointer"
}}
>

Reload

</button>

</div>

);

}

return this.props.children;

}

}

export default ErrorBoundary;