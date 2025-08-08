const TeamItem = () => {
    return (
        <div className="col-lg-4" style={{marginBottom:16}}>
            <div className="card" style={{textAlign:'center'}}>
                <img src="/img/team.jpg" alt="team" className="card-image" style={{height:260,objectFit:'cover'}} />
                <div className="card-body">
                    <h5 style={{margin:0}}>Lorem Ipsum</h5>
                    <div className="card-sub">Lorem ipsum dolor</div>
                    <div style={{display:'flex',gap:10,justifyContent:'center'}}>
                        <div className="icon"><i className="fab fa-facebook"></i></div>
                        <div className="icon"><i className="fab fa-twitter"></i></div>
                        <div className="icon"><i className="fab fa-instagram"></i></div>
                        <div className="icon"><i className="fab fa-linkedin"></i></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamItem