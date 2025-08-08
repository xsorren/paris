const Title = ({ title, description }) => {
    return (
        <div style={{textAlign:'center',margin:'10px 0 20px'}}>
            <h2 className="title-xl" style={{fontSize:28,margin:'8px 0'}}>{title}</h2>
            <div className="title-underline" />
            {description && (
                <p style={{color:'var(--muted)',maxWidth:720,margin:'0 auto'}}>{description}</p>
            )}
        </div>
    );
};

export default Title;