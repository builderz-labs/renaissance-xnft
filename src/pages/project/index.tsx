import { useParams } from 'react-router-dom';
function ProjectPage({ allCollections }: any) {

    const { name } = useParams();

    console.log("name:", name);
    console.log("allCollections:", allCollections);

    const collection = allCollections?.length
        ? allCollections.find((c: any) => c.name === name)
        : null;

    return (
        <div>
            {collection ? (
                <div>Collection Title: {collection.name}</div>
            ) : (
                <div>No collection found with name {name}</div>
            )}
        </div>
    );
}

export default ProjectPage;