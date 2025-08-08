import Title from "./Title"
import TeamItem from "./TeamItem"

const TeamList = () => {
    const title = {
        text: "Lorem Ipsum",
        description: "Lorem ipsum dolor sit ame"
    }
    return (
        <section>
            <div className="container-narrow">
                <Title title={title.text} description={title.description} />
                <div className="row">
                    <TeamItem/>
                    <TeamItem/>
                    <TeamItem/>
                </div>
            </div>
        </section>
    )
}

export default TeamList;