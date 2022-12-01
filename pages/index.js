import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
//     adress: "Some address 5, 12345 Some City",
//     decription: "This is a first meetup!",
//   },
//   {
//     id: "m2",
//     title: "A Second Meetup",
//     image:
//       "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
//     adress: "Some address 10, 12345 Some City",
//     decription: "This is a second meetup!",
//   },
// ];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name='description'
        content='Browse a huge list of hightly active React meetups!' />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// la fonction ci-dessous permet d'ajouter les données dans l'HTML directement par le server, c'est quand on build le projet que cela est fait

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://Yasser:carI3qYQOECxtEW1@cluster0.gl9e31c.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // ici revalidate permet de regénérer toutes les 10 secondes le tableau de données récupéré si les données changent régulièrement, sinon le problème qu'il y aura sera que le tableau sera le même que celui générée par le serveur la première fois
  };
}

// la fonction ci dessous permet de regénérer la page par le serveur à chaque requête, ici ce n'est pas nécessaire on prendra en solution la fonction ci dessus.

// export async function getServerSideProps(context){

//     const req = context.req;
//     const res = context.res;

//     // fetch data from an API
//     return {
//         props: DUMMY_MEETUPS
//     };
// }

export default HomePage;
