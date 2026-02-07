import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardChartsProps {
  data: {
    productsByCategory: { name: string; value: number }[];
    priceRangeDistribution: { name: string; value: number }[];
    topRatedProducts: { name: string; rating: number; price: number }[];
  };
  loading: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function DashboardCharts({ data, loading }: DashboardChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse h-[400px]">
            <CardHeader>
              <div className="h-6 w-48 bg-muted rounded mb-2"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/10 rounded m-4"></CardContent>
          </Card>
        ))}
        <Card className="animate-pulse h-[400px] col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded mb-2"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/10 rounded m-4"></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Products by Category - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Products by Category</CardTitle>
          <CardDescription>
            Distribution of products across categories
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.productsByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.productsByCategory.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Range Distribution - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range Distribution</CardTitle>
          <CardDescription>Number of products in price buckets</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.priceRangeDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 10 Rated Products - Horizontal Bar Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Top 10 Rated Products</CardTitle>
          <CardDescription>
            Highest rated products in the inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data.topRatedProducts}
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.3}
                horizontal={false}
              />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                fontSize={12}
                tickFormatter={(value) =>
                  value.length > 20 ? `${value.substring(0, 20)}...` : value
                }
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="rating" fill="#82ca9d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
