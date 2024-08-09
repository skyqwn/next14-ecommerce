import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Socials from "./socials";
import BackButton from "./back-button";

interface AuthCardProps {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonlabel: string;
  showSocial?: boolean;
}
const AuthCard = ({
  children,
  backButtonHref,
  backButtonlabel,
  cardTitle,
  showSocial,
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonlabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
