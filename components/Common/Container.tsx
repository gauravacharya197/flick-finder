import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <section className="pb-10  pt-5 md:pt-5 xl:pt-11">
    
    <div>
    <div className={`px-4 lg:px-12 2xl:px-48 ${className}`}>
      {children}
    </div>
    </div>
    </section>
  );
};

export default Container;
