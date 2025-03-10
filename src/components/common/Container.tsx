import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  return (
    <section className="mt-16">
    
    <div>
    <div className={`px-4  ${className}`}>
      {children}
    </div>
    </div>
    </section>
  );
};

export default Container;
