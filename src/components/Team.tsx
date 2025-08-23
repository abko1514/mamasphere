import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Team () {
  const team = [
    {
      avatar: "https://avatars.githubusercontent.com/u/127621443?v=4",
      name: "Abhishikta Ray",
      title: "Full Stack Developer",
      linkedin: "https://www.linkedin.com/in/abhishikta-ray-321315258/",
      github: "https://github.com/AbhishiktaRay03",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/122633300?v=4",
      name: "Komal Agarwal",
      title: "Full Stack Developer",
      linkedin: "www.linkedin.com/in/komal-agarwal5",
      github: "https://github.com/komal-agarwal5",
    },
  ];

  return (
    <section className="py-14">
      <div className="max-w-screen-xl mx-auto px-4 text-center md:px-8">
        <div className="max-w-xl mx-auto">
          <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Meet our team
          </h3>
          <p className="text-gray-600 mt-3">
            A passionate daughter duo committed to empowering working mothers
            with innovative solutions.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            {team.map((item, idx) => (
              <li key={idx}>
                <div className="w-20 h-20 mx-auto">
                  <img
                    src={item.avatar}
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <div className="mt-2">
                  <h4 className="text-gray-700 font-semibold sm:text-lg">
                    {item.name}
                  </h4>
                  <p className="text-indigo-600">{item.title}</p>
                <div className="flex gap-2 justify-center items-center my-2 text-gray-800">
                  <Link href={item.linkedin}>
                    <Linkedin />
                  </Link>
                  <Link href={item.github}>
                    <Github />
                  </Link>
                </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
