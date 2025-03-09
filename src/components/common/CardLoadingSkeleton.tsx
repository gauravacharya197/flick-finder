import Container from "./Container";
import Skeleton from "./Skeleton";

export const CardLoadingSkeleton = () => (
    <Container>
    <div className="grid mb-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton 
                showTitle={false}
                rows={1}
                rowWidths={['100%'] as any}
                rowHeight="h-[160px]"
                spacing="space-y-2"
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </Container>
    );