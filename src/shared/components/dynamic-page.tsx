const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {};

interface DynamicPageProps {
  component: string;
}

export const DynamicPage = ({ component }: DynamicPageProps) => {
  const Component = componentMap[component];
  return Component ? <Component /> : <div>Component not found</div>;
};
