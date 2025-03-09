import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <section className="pb-10">
    
    <div>
    <div className={`px-4  ${className}`}>
      {children}
    </div>
    </div>
    </section>
  );
};

export default Container;
